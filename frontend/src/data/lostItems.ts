import type { LostItem } from '../types'

export const mockLostItems: LostItem[] = [
  {
    id: 'l-201',
    title: 'Black Wallet with Silver Stripe',
    category: 'Accessories',
    location: 'Main Canteen',
    lostAt: '2025-12-05T19:20:00Z',
    description: 'Contains college ID, metro card, and library receipts. Lost near the dessert counter.',
    reward: 'Grab a coffee on me!',
    status: 'open',
  },
  {
    id: 'l-198',
    title: 'Physics Lab Record Book',
    category: 'Books',
    location: 'Block A — Room 302',
    lostAt: '2025-12-04T10:10:00Z',
    description: 'Blue hardcover lab record with name tag of Harshit M. Left during experiment session.',
    status: 'matched',
  },
  {
    id: 'l-192',
    title: 'Lenovo ThinkPad Charger',
    category: 'Electronics',
    location: 'Innovation Center',
    lostAt: '2025-12-01T14:50:00Z',
    description: '65W USB-C charger with a green velcro tie. Lost after hackathon meetup.',
    status: 'closed',
  },
]
