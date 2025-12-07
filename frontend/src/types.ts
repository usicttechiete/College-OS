export type Status =
  | 'available'
  | 'matched'
  | 'returned'
  | 'verification-pending'
  | 'open'
  | 'closed'

export interface FoundItem {
  id: string
  title: string
  category: string
  location: string
  foundAt: string
  description: string
  imageUrl: string
  submissionType: 'keep-with-me' | 'submit-to-desk'
  status: Status
  finder: {
    name: string
    avatarUrl: string
    trustScore: number
    isTrustedHelper: boolean
  }
  distanceMinutes: number
  verification: {
    verified: boolean
    notes?: string
    matchConfidence: number
  }
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
