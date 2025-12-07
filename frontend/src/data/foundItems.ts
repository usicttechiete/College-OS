import type { FoundItem } from '../types'

export const mockFoundItems: FoundItem[] = [
  {
    id: 'f-001',
    title: 'Blue Backpack with Stickers',
    category: 'Bags',
    location: 'Library — Silent Zone',
    foundAt: '2025-12-02T11:30:00Z',
    description:
      'Contains engineering drawing notebook, pencil case, and USB drive. Left near workstation 12.',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    submissionType: 'keep-with-me',
    status: 'available',
  },
  {
    id: 'f-002',
    title: 'Apple AirPods (3rd Gen)',
    category: 'Electronics',
    location: 'Cafeteria — Juice Counter',
    foundAt: '2025-12-04T13:15:00Z',
    description:
      'Found inside a black case with a sticker of the robotics club. Battery at 70%.',
    imageUrl:
      'https://images.unsplash.com/photo-1585386959984-a4155228ef44?auto=format&fit=crop&w=800&q=80',
    submissionType: 'submit-to-desk',
    status: 'matched',
  },
  {
    id: 'f-003',
    title: 'Mechanical Keyboard',
    category: 'Electronics',
    location: 'Computer Lab — Block C',
    foundAt: '2025-12-05T09:45:00Z',
    description:
      'Grey keyboard with custom keycaps. Found plugged into PC-18 after lab hours.',
    imageUrl:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    submissionType: 'keep-with-me',
    status: 'available',
  },
  {
    id: 'f-004',
    title: 'Hostel Room Keychain',
    category: 'Keys',
    location: 'Main Auditorium',
    foundAt: '2025-12-03T18:20:00Z',
    description:
      'Keychain with dorm pass card and a small plush tiger. Picked up after the drama club event.',
    imageUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    submissionType: 'submit-to-desk',
    status: 'returned',
  },
]
