export type Status =
  | 'available'
  | 'matched'
  | 'returned'
  | 'verification-pending'
  | 'open'
  | 'closed'

export interface FoundItem {
  id: string
  finderId: string
  title: string
  category: string
  location: string
  foundAt: string
  description: string
  imageUrls: string[] // Array of image URLs
  submissionType: 'keep-with-me' | 'submit-to-desk'
  status: Status
  finder: {
    id: string
    name: string
    avatarUrl: string
    trustScore: number
    isTrustedHelper: boolean
  }
  distanceMinutes?: number // Optional, calculated on frontend if needed
  verification: {
    verified: boolean
    notes?: string | null
    matchConfidence: number
  }
  claimedBy?: string | null
  claimedAt?: string | null
  returnedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface LostItem {
  id: string
  title: string
  category: string
  location: string
  lostAt: string
  description: string
  reward?: string
  status: Status
}
