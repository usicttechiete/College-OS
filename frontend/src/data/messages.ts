export interface MessageThread {
  id: string
  peerName: string
  itemTitle: string
  lastMessage: string
  timestamp: string
  unreadCount: number
}

export const mockThreads: MessageThread[] = [
  {
    id: 'm-001',
    peerName: 'Arjun Mehta',
    itemTitle: 'Apple AirPods (3rd Gen)',
    lastMessage: 'Sure, I can meet you outside the library at 5 pm.',
    timestamp: '2025-12-05T15:30:00Z',
    unreadCount: 0,
  },
  {
    id: 'm-002',
    peerName: 'Nisha Rao',
    itemTitle: 'Blue Backpack with Stickers',
    lastMessage: 'I have your ID card inside. Could you describe the stickers?',
    timestamp: '2025-12-05T10:45:00Z',
    unreadCount: 3,
  },
  {
    id: 'm-003',
    peerName: 'Student Cell Desk',
    itemTitle: 'Verification Pending — Hostel Room Keychain',
    lastMessage: 'Please bring your hostel pass tomorrow for verification.',
    timestamp: '2025-12-04T08:20:00Z',
    unreadCount: 0,
  },
]
