# Found Items Backend Implementation Plan

## Overview
This document outlines a comprehensive, phase-wise plan to implement the Found Items feature in the backend using Supabase Auth, and connect it seamlessly with the frontend. The plan ensures robust authentication, proper data modeling, and a scalable architecture.

---

## Phase 1: Supabase Database Schema Setup

### 1.1 Create `found_items` Table
**Objective**: Design and create the database table to store all found item posts with proper relationships and constraints.

**Database Schema Design**:
```sql
CREATE TABLE public.found_items (
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
```

**Key Design Decisions**:
- Use UUID for primary keys (consistent with Supabase auth)
- Foreign key to `profiles` table for finder relationship
- Array field for `image_urls` to support multiple images per item
- Status enum with clear states for workflow tracking
- Separate timestamps for found, claimed, and returned events
- Optional `claimed_by` reference for tracking claimer

**Indexes**:
```sql
-- Performance indexes
CREATE INDEX idx_found_items_finder_id ON public.found_items(finder_id);
CREATE INDEX idx_found_items_status ON public.found_items(status);
CREATE INDEX idx_found_items_category ON public.found_items(category);
CREATE INDEX idx_found_items_found_at ON public.found_items(found_at DESC);
CREATE INDEX idx_found_items_location ON public.found_items(location);
CREATE INDEX idx_found_items_claimed_by ON public.found_items(claimed_by);
```

**Row Level Security (RLS) Policies**:
```sql
-- Enable RLS
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

-- Policy 4: Finders can delete their own items (soft delete via status)
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
```

**Triggers**:
```sql
-- Auto-update updated_at timestamp
CREATE TRIGGER found_items_updated_at
  BEFORE UPDATE ON public.found_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

**Deliverables**:
- Migration file: `backend/db/migrations/002_create_found_items_table.sql`
- Documentation of schema decisions
- RLS policy documentation

**Acceptance Criteria**:
- Table created successfully in Supabase
- RLS policies enforce proper access control
- Indexes improve query performance
- Foreign key constraints maintain data integrity

---

## Phase 2: Backend API Routes Implementation

### 2.1 Create Found Items Routes
**Objective**: Implement RESTful API endpoints for found items CRUD operations with proper authentication and validation.

**Route Structure**:
```
POST   /found                    - Create a new found item
GET    /found                    - List all found items (with filters)
GET    /found/:id                - Get a specific found item
PATCH  /found/:id                - Update a found item (finder only)
DELETE /found/:id                - Delete a found item (finder only)
GET    /found/my-items           - Get current user's found items
POST   /found/:id/claim          - Claim a found item
POST   /found/:id/unclaim        - Unclaim a found item
PATCH  /found/:id/status         - Update item status (finder/admin)
```

**File Structure**:
```
backend/
  src/
    routes/
      found.js              - Found items routes
    controllers/
      foundController.js     - Business logic for found items
    middlewares/
      validation.js          - Request validation middleware
    utils/
      imageUpload.js         - Image upload utilities (future)
```

**API Endpoint Specifications**:

#### POST `/found`
**Purpose**: Create a new found item post
**Auth**: Required (authenticated users only)
**Request Body**:
```json
{
  "title": "Blue Backpack with Stickers",
  "category": "Bags",
  "description": "Contains engineering drawing notebook, pencil case, and USB drive.",
  "location": "Library — Silent Zone",
  "foundAt": "2025-12-02T11:30:00Z", // ISO 8601 format
  "submissionType": "keep-with-me", // or "submit-to-desk"
  "imageUrls": ["https://example.com/image1.jpg"], // Array of image URLs
  "verificationNotes": "Owner must mention laptop sticker set." // Optional
}
```

**Validation Rules**:
- `title`: Required, string, 3-200 characters
- `category`: Required, must be one of: Electronics, Bags, Accessories, Keys, Books, ID Cards, Other
- `description`: Required, string, 10-2000 characters
- `location`: Required, string, 3-200 characters
- `foundAt`: Required, valid ISO 8601 datetime, not in future
- `submissionType`: Required, must be "keep-with-me" or "submit-to-desk"
- `imageUrls`: Optional, array of valid URLs, max 5 images
- `verificationNotes`: Optional, string, max 500 characters

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Found item created successfully",
  "data": {
    "item": {
      "id": "uuid",
      "finderId": "uuid",
      "title": "...",
      "category": "...",
      "status": "available",
      "createdAt": "2025-12-02T11:30:00Z",
      ...
    }
  }
}
```

#### GET `/found`
**Purpose**: List all found items with filtering, sorting, and pagination
**Auth**: Optional (public can view available items)
**Query Parameters**:
- `status`: Filter by status (available, matched, returned, verification-pending)
- `category`: Filter by category
- `location`: Filter by location (partial match)
- `finderId`: Filter by finder ID (for admin)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sortBy`: Sort field (foundAt, createdAt, title) (default: foundAt)
- `sortOrder`: asc or desc (default: desc)
- `search`: Full-text search on title and description

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### GET `/found/:id`
**Purpose**: Get detailed information about a specific found item
**Auth**: Optional (public can view available items, authenticated can view their own items)
**Response**: Full item object with finder profile information

#### PATCH `/found/:id`
**Purpose**: Update a found item (only by finder)
**Auth**: Required
**Request Body**: Partial update (only send fields to update)
**Validation**: Same as POST, but all fields optional

#### DELETE `/found/:id`
**Purpose**: Delete a found item (soft delete by setting status)
**Auth**: Required (finder only)
**Note**: Consider soft delete by updating status to a "deleted" state instead of hard delete

#### GET `/found/my-items`
**Purpose**: Get all found items posted by the current user
**Auth**: Required
**Query Parameters**: Same filtering options as GET `/found`

#### POST `/found/:id/claim`
**Purpose**: Claim a found item
**Auth**: Required
**Request Body**:
```json
{
  "claimMessage": "This matches my lost item description. I can provide proof."
}
```

**Business Logic**:
- Check if item status is "available"
- Set `claimed_by` to current user ID
- Set `claimed_at` to current timestamp
- Update status to "matched"
- Create a message thread (if messaging system exists)

#### POST `/found/:id/unclaim`
**Purpose**: Unclaim a found item (claimer or finder can do this)
**Auth**: Required
**Business Logic**:
- Reset `claimed_by` and `claimed_at`
- Update status back to "available"

#### PATCH `/found/:id/status`
**Purpose**: Update item status (for workflow management)
**Auth**: Required (finder or admin)
**Request Body**:
```json
{
  "status": "returned",
  "notes": "Item successfully returned to owner"
}
```

**Deliverables**:
- `backend/src/routes/found.js` - Route definitions
- `backend/src/controllers/foundController.js` - Business logic
- Request validation middleware
- Error handling and response formatting
- API documentation/comments

**Acceptance Criteria**:
- All endpoints return proper HTTP status codes
- Authentication middleware properly protects routes
- Validation prevents invalid data
- RLS policies are respected
- Error messages are user-friendly
- Pagination works correctly
- Filtering and sorting function as expected

---

## Phase 3: Backend Integration with Supabase

### 3.1 Supabase Client Integration
**Objective**: Ensure found items routes use Supabase client correctly with proper RLS handling.

**Implementation Details**:
- Use `supabaseAdmin` for operations that need to bypass RLS (when appropriate)
- Use `createUserClient(accessToken)` for user-scoped operations
- Handle Supabase errors gracefully
- Implement proper transaction handling for multi-step operations

**Error Handling**:
- Map Supabase errors to user-friendly messages
- Log errors for debugging
- Return appropriate HTTP status codes

**Deliverables**:
- Updated found items controller with Supabase integration
- Error handling utilities
- Logging configuration

**Acceptance Criteria**:
- All database operations use Supabase client correctly
- Errors are handled gracefully
- RLS policies are respected
- Operations are atomic where needed

---

## Phase 4: Frontend-Backend Connection

### 4.1 Update Frontend API Client
**Objective**: Add found items API methods to the frontend API client.

**File**: `frontend/src/lib/api.ts`

**New API Methods**:
```typescript
export const foundApi = {
  // Create a new found item
  create: (token: string, data: FoundItemFormData) => 
    request<FoundItem>('/found', { method: 'POST', token, body: data }),
  
  // Get all found items with filters
  getAll: (token: string | null, params?: FoundItemsQueryParams) => 
    request<{ items: FoundItem[]; pagination: Pagination }>('/found', { token, params }),
  
  // Get a specific found item
  getById: (token: string | null, id: string) => 
    request<FoundItem>(`/found/${id}`, { token }),
  
  // Update a found item
  update: (token: string, id: string, data: Partial<FoundItemFormData>) => 
    request<FoundItem>(`/found/${id}`, { method: 'PATCH', token, body: data }),
  
  // Delete a found item
  delete: (token: string, id: string) => 
    request(`/found/${id}`, { method: 'DELETE', token }),
  
  // Get current user's found items
  getMyItems: (token: string, params?: FoundItemsQueryParams) => 
    request<{ items: FoundItem[]; pagination: Pagination }>('/found/my-items', { token, params }),
  
  // Claim a found item
  claim: (token: string, id: string, claimMessage?: string) => 
    request<FoundItem>(`/found/${id}/claim`, { method: 'POST', token, body: { claimMessage } }),
  
  // Unclaim a found item
  unclaim: (token: string, id: string) => 
    request<FoundItem>(`/found/${id}/unclaim`, { method: 'POST', token }),
  
  // Update item status
  updateStatus: (token: string, id: string, status: Status, notes?: string) => 
    request<FoundItem>(`/found/${id}/status`, { method: 'PATCH', token, body: { status, notes } }),
};
```

**Type Definitions**:
```typescript
interface FoundItemFormData {
  title: string;
  category: string;
  description: string;
  location: string;
  foundAt: string; // ISO 8601
  submissionType: 'keep-with-me' | 'submit-to-desk';
  imageUrls?: string[];
  verificationNotes?: string;
}

interface FoundItemsQueryParams {
  status?: Status;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: 'foundAt' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

**Deliverables**:
- Updated `api.ts` with found items methods
- Type definitions for API requests/responses
- Error handling in API client

**Acceptance Criteria**:
- All API methods are properly typed
- Error handling works correctly
- Token is passed correctly for authenticated requests

---

## Phase 5: Frontend Integration - Replace Mock Data

### 5.1 Update FoundFormPage
**Objective**: Connect the found item form to the backend API.

**File**: `frontend/src/pages/FoundFormPage.tsx`

**Changes Required**:
1. Add form state management (useState or form library)
2. Add form validation
3. Connect form submission to `foundApi.create()`
4. Show loading states during submission
5. Handle success/error responses
6. Redirect to Found page on success
7. Handle image URL input (support multiple URLs)

**Form Fields Mapping**:
- `title` → `title`
- `category` → `category`
- `location` → `location`
- `foundAt` (datetime-local) → `foundAt` (ISO 8601)
- `description` → `description`
- `submission` → `submissionType`
- `imageUrl` → `imageUrls` (array)

**Deliverables**:
- Updated FoundFormPage with real API integration
- Form validation
- Loading and error states
- Success feedback

**Acceptance Criteria**:
- Form validates all required fields
- Successful submission creates item in database
- User sees confirmation and is redirected
- Errors are displayed clearly
- Loading state prevents double submission

---

### 5.2 Update FoundPage
**Objective**: Replace mock data with real data from backend API.

**File**: `frontend/src/pages/FoundPage.tsx`

**Changes Required**:
1. Remove import of `mockFoundItems`
2. Add state for items and loading
3. Fetch items on component mount using `foundApi.getAll()`
4. Pass filter parameters to API
5. Handle pagination
6. Show loading skeleton while fetching
7. Handle empty states
8. Handle errors gracefully

**Filter Integration**:
- Map frontend filter state to API query parameters
- Debounce search input
- Update URL query params for shareable filtered views (optional)

**Deliverables**:
- Updated FoundPage with real data fetching
- Loading states
- Error handling
- Filter integration with backend

**Acceptance Criteria**:
- Page loads items from backend on mount
- Filters work correctly with backend
- Pagination works
- Loading and error states are handled
- Empty state is shown when no items

---

### 5.3 Update ItemCard Component
**Objective**: Ensure ItemCard displays data correctly from backend.

**File**: `frontend/src/components/ItemCard.tsx`

**Changes Required**:
1. Verify all fields map correctly from backend response
2. Handle missing optional fields gracefully
3. Format dates correctly
4. Handle multiple images (show first image, or carousel)
5. Update finder information display (fetch from profiles if needed)

**Data Mapping**:
- Backend `found_at` → Frontend `foundAt`
- Backend `image_urls` → Frontend `imageUrl` (use first image)
- Backend `submission_type` → Frontend `submissionType`
- Backend `finder_id` → Frontend `finder` (need to join/fetch profile)
- Backend `verification_notes` → Frontend `verification.notes`
- Backend `match_confidence` → Frontend `verification.matchConfidence`
- Backend `is_verified` → Frontend `verification.verified`

**Note**: Backend response should include finder profile information via JOIN or separate fetch.

**Deliverables**:
- Updated ItemCard if needed
- Data transformation utilities if needed

**Acceptance Criteria**:
- All item data displays correctly
- Missing fields are handled gracefully
- Images display correctly
- Dates are formatted properly

---

### 5.4 Update Types
**Objective**: Ensure TypeScript types match backend response structure.

**File**: `frontend/src/types.ts`

**Changes Required**:
1. Update `FoundItem` interface to match backend response
2. Add new types for API requests/responses
3. Ensure type safety throughout

**Updated FoundItem Type**:
```typescript
export interface FoundItem {
  id: string;
  finderId: string;
  title: string;
  category: string;
  location: string;
  foundAt: string; // ISO 8601
  description: string;
  imageUrls: string[]; // Array of URLs
  submissionType: 'keep-with-me' | 'submit-to-desk';
  status: Status;
  finder: {
    id: string;
    name: string;
    avatarUrl: string;
    trustScore: number;
    isTrustedHelper: boolean;
  };
  verification: {
    verified: boolean;
    notes?: string;
    matchConfidence: number;
  };
  distanceMinutes?: number; // Calculated on frontend or backend
  claimedBy?: string;
  claimedAt?: string;
  returnedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Deliverables**:
- Updated type definitions
- Type-safe API integration

**Acceptance Criteria**:
- Types match backend response structure
- No TypeScript errors
- Type safety is maintained

---

## Phase 6: Backend Response Enhancement

### 6.1 Include Related Data
**Objective**: Ensure backend responses include all necessary related data (e.g., finder profile).

**Implementation**:
- Use Supabase JOINs or separate queries to fetch finder profile
- Include finder information in GET responses
- Calculate derived fields (e.g., `distanceMinutes` if location-based)

**Response Structure**:
```json
{
  "id": "uuid",
  "finderId": "uuid",
  "title": "...",
  "category": "...",
  "location": "...",
  "foundAt": "2025-12-02T11:30:00Z",
  "description": "...",
  "imageUrls": ["..."],
  "submissionType": "keep-with-me",
  "status": "available",
  "finder": {
    "id": "uuid",
    "name": "Arjun Mehta",
    "email": "arjun@college.edu",
    "profilePic": "https://...",
    "trustScore": 92,
    "isTrustedHelper": true
  },
  "verification": {
    "verified": true,
    "notes": "...",
    "matchConfidence": 84
  },
  "createdAt": "2025-12-02T11:30:00Z",
  "updatedAt": "2025-12-02T11:30:00Z"
}
```

**Deliverables**:
- Updated controller to include related data
- Optimized queries (avoid N+1 problem)

**Acceptance Criteria**:
- Responses include all necessary data
- Queries are optimized
- No unnecessary data is included

---

## Phase 7: Testing & Validation

### 7.1 Backend Testing
**Objective**: Test all backend endpoints and business logic.

**Test Cases**:
1. Create found item (authenticated)
2. Create found item (unauthenticated) - should fail
3. List found items (public)
4. List found items with filters
5. Get specific found item
6. Update found item (as finder)
7. Update found item (as different user) - should fail
8. Delete found item (as finder)
9. Claim found item
10. Unclaim found item
11. Update status
12. Pagination
13. Search functionality

**Deliverables**:
- Test cases documented
- Manual testing completed
- Postman/Insomnia collection (optional)

**Acceptance Criteria**:
- All endpoints work correctly
- Authentication/authorization works
- Validation works
- Error handling works

---

### 7.2 Frontend Testing
**Objective**: Test frontend integration with backend.

**Test Cases**:
1. Submit found item form (success)
2. Submit found item form (validation errors)
3. Submit found item form (network error)
4. Load found items list
5. Apply filters
6. Pagination
7. View item details
8. Claim item
9. Update own found item
10. Delete own found item

**Deliverables**:
- Manual testing completed
- Bug fixes applied

**Acceptance Criteria**:
- All user flows work correctly
- Error states are handled
- Loading states work
- UI is responsive

---

## Phase 8: Documentation & Deployment

### 8.1 API Documentation
**Objective**: Document all API endpoints.

**Deliverables**:
- API endpoint documentation
- Request/response examples
- Error codes documentation

---

### 8.2 Database Migration
**Objective**: Run migration in Supabase production.

**Steps**:
1. Review migration SQL
2. Test migration in staging
3. Run migration in production
4. Verify RLS policies
5. Verify indexes

**Deliverables**:
- Migration executed successfully
- Verification completed

---

### 8.3 Environment Configuration
**Objective**: Ensure all environment variables are configured.

**Backend Variables**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `FRONTEND_URL`

**Frontend Variables**:
- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Deliverables**:
- Environment variables documented
- `.env.example` files updated

---

## Summary of Required Fields for Found Items

Based on the frontend form and display requirements, here are all fields needed in the Supabase `found_items` table:

### Required Fields:
1. **id** (UUID) - Primary key
2. **finder_id** (UUID) - Foreign key to profiles
3. **title** (TEXT) - Item title/name
4. **category** (TEXT) - One of: Electronics, Bags, Accessories, Keys, Books, ID Cards, Other
5. **description** (TEXT) - Detailed description
6. **location** (TEXT) - Where the item was found
7. **found_at** (TIMESTAMPTZ) - When the item was found
8. **submission_type** (TEXT) - "keep-with-me" or "submit-to-desk"
9. **status** (TEXT) - available, matched, returned, verification-pending
10. **created_at** (TIMESTAMPTZ) - Record creation timestamp
11. **updated_at** (TIMESTAMPTZ) - Last update timestamp

### Optional Fields:
12. **image_urls** (TEXT[]) - Array of image URLs
13. **verification_notes** (TEXT) - Notes for verification
14. **match_confidence** (INTEGER) - Match confidence score (0-100)
15. **is_verified** (BOOLEAN) - Whether item is verified
16. **claimed_by** (UUID) - User who claimed the item
17. **claimed_at** (TIMESTAMPTZ) - When item was claimed
18. **returned_at** (TIMESTAMPTZ) - When item was returned

### Derived/Computed Fields (not stored in DB):
- **finder** (object) - Finder profile information (joined from profiles table)
- **distanceMinutes** (number) - Calculated distance (if location-based features are implemented)

---

## Dependencies & Prerequisites

### Before Starting:
1. ✅ Supabase project created and configured
2. ✅ Backend Supabase client setup complete
3. ✅ Authentication system working (Phase 1-3 of supabase-auth-plan.md)
4. ✅ Frontend auth context integrated
5. ✅ Profiles table created and working

### External Dependencies:
- Supabase project access
- Environment variables configured
- Image hosting solution (for image URLs) - can use Supabase Storage in future

---

## Timeline Estimate

- **Phase 1**: Database Schema Setup - 1-2 days
- **Phase 2**: Backend API Routes - 3-4 days
- **Phase 3**: Supabase Integration - 1 day
- **Phase 4**: Frontend API Client - 1 day
- **Phase 5**: Frontend Integration - 3-4 days
- **Phase 6**: Backend Response Enhancement - 1 day
- **Phase 7**: Testing & Validation - 2-3 days
- **Phase 8**: Documentation & Deployment - 1 day

**Total Estimated Time**: 13-17 days

---

## Notes & Considerations

1. **Image Storage**: Initially using image URLs. Future enhancement: Use Supabase Storage for image uploads
2. **Location-based Features**: `distanceMinutes` can be calculated on frontend or backend using geolocation APIs
3. **Search**: Full-text search can be enhanced with PostgreSQL full-text search capabilities
4. **Caching**: Consider implementing caching for frequently accessed found items
5. **Real-time Updates**: Future enhancement: Use Supabase Realtime for live updates
6. **Soft Delete**: Consider implementing soft delete instead of hard delete
7. **Audit Logging**: Consider adding audit logs for important actions (claim, return, etc.)

---

## Success Criteria

✅ Found items can be created through the frontend form
✅ Found items are stored in Supabase with proper relationships
✅ Found items list displays real data from backend
✅ Filters work correctly with backend
✅ Authentication is properly enforced
✅ RLS policies protect data appropriately
✅ Frontend and backend are fully integrated
✅ All user flows work end-to-end

