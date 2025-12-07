-- Migration: Create found_items table
-- This table stores all found item posts with proper relationships and constraints

CREATE TABLE IF NOT EXISTS public.found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Core item information
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Electronics', 'Bags', 'Accessories', 'Keys', 'Books', 'ID Cards', 'Other')),
  description TEXT NOT NULL,
  
  -- Location and timing
  location TEXT NOT NULL,
  found_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Submission details
  submission_type TEXT NOT NULL CHECK (submission_type IN ('keep-with-me', 'submit-to-desk')),
  
  -- Media
  image_urls TEXT[] DEFAULT '{}', -- Array of image URLs (supporting multiple images)
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'matched', 'returned', 'verification-pending')),
  
  -- Verification and matching
  verification_notes TEXT,
  match_confidence INTEGER DEFAULT 0 CHECK (match_confidence >= 0 AND match_confidence <= 100),
  is_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- User who claimed the item
  claimed_at TIMESTAMPTZ, -- When the item was claimed
  returned_at TIMESTAMPTZ -- When the item was successfully returned
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_found_items_finder_id ON public.found_items(finder_id);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON public.found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_category ON public.found_items(category);
CREATE INDEX IF NOT EXISTS idx_found_items_found_at ON public.found_items(found_at DESC);
CREATE INDEX IF NOT EXISTS idx_found_items_location ON public.found_items(location);
CREATE INDEX IF NOT EXISTS idx_found_items_claimed_by ON public.found_items(claimed_by);

-- Enable Row Level Security
ALTER TABLE public.found_items ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view available found items (for browsing)
CREATE POLICY "Anyone can view available found items"
  ON public.found_items
  FOR SELECT
  USING (status = 'available' OR auth.uid() = finder_id OR auth.uid() = claimed_by);

-- Policy 2: Authenticated users can create found items
CREATE POLICY "Authenticated users can create found items"
  ON public.found_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = finder_id);

-- Policy 3: Finders can update their own items
CREATE POLICY "Finders can update own found items"
  ON public.found_items
  FOR UPDATE
  USING (auth.uid() = finder_id)
  WITH CHECK (auth.uid() = finder_id);

-- Policy 4: Finders can delete their own items
CREATE POLICY "Finders can delete own found items"
  ON public.found_items
  FOR DELETE
  USING (auth.uid() = finder_id);

-- Policy 5: Service role has full access (for backend operations)
CREATE POLICY "Service role has full access to found_items"
  ON public.found_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER found_items_updated_at
  BEFORE UPDATE ON public.found_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for full-text search on title and description
CREATE INDEX IF NOT EXISTS idx_found_items_search ON public.found_items USING gin(to_tsvector('english', title || ' ' || description));

