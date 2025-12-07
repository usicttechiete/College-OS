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
    finder: {
      name: 'Arjun Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80',
      trustScore: 92,
      isTrustedHelper: true,
    },
    distanceMinutes: 6,
    verification: {
      verified: true,
      notes: 'Owner must mention laptop sticker set.',
      matchConfidence: 84,
    },
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
    finder: {
      name: 'Student Cell Desk',
      avatarUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=256&q=80',
      trustScore: 100,
      isTrustedHelper: true,
    },
    distanceMinutes: 12,
    verification: {
      verified: true,
      notes: 'Awaiting claimant to bring proof of purchase.',
      matchConfidence: 91,
    },
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
    status: 'verification-pending',
    finder: {
      name: 'Nisha Rao',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      trustScore: 78,
      isTrustedHelper: false,
    },
    distanceMinutes: 9,
    verification: {
      verified: false,
      notes: 'Waiting for claimant to describe unique keycap colours.',
      matchConfidence: 62,
    },
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
    finder: {
      name: 'Campus Security',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      trustScore: 88,
      isTrustedHelper: true,
    },
    distanceMinutes: 15,
    verification: {
      verified: true,
      notes: 'Returned after ID confirmation at Student Cell.',
      matchConfidence: 99,
    },
  },
]
