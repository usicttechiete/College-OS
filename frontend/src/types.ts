export type Status = 'available' | 'matched' | 'returned' | 'open' | 'closed'

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
