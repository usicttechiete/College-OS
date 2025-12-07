import { Home, Inbox, MessagesSquare, UserRound } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { mockThreads } from '../data/messages'

const navItems = [
  { id: 'home', label: 'Home', icon: Home, to: '/home' },
  { id: 'found', label: 'Found', icon: Inbox, to: '/found' },
  { id: 'messages', label: 'Messages', icon: MessagesSquare, to: '/messages' },
  { id: 'account', label: 'Account', icon: UserRound, to: '/account' },
]

const BottomNav = () => {
  const location = useLocation()
  const unreadMessages = useMemo(() => mockThreads.reduce((acc, thread) => acc + thread.unreadCount, 0), [])

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[var(--z-sticky,40)] flex justify-center bg-gradient-to-t from-neutral-0 via-neutral-0/90 to-transparent" aria-label="Global navigation">
      <div className="mb-3 flex w-full max-w-md items-center justify-between gap-1.5 rounded-[18px] border border-purple-200/60 bg-gradient-to-r from-purple-50/95 via-indigo-50/95 to-blue-50/95 px-4 py-2.5 text-neutral-500 shadow-colored backdrop-blur">
        <span id="bottom-nav-live" className="sr-only" aria-live="polite">
          {unreadMessages > 0 ? `${unreadMessages} new messages` : 'No unread messages'}
        </span>
        {navItems.map(({ id, label, icon: Icon, to }) => (
          <NavLink
            key={id}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              [
                'group relative flex flex-1 flex-col items-center gap-1.5 rounded-[14px] px-1.5 py-[5px] text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-150 ease-in-out-200 focus-visible:outline-none',
                isActive ? 'text-primary' : 'text-neutral-400',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex size-10 items-center justify-center rounded-full border transition-all duration-150 ease-in-out-200 ${
                    isActive
                      ? 'scale-105 border-purple-300/50 bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground shadow-colored'
                      : 'border-transparent bg-gradient-to-br from-neutral-100 to-neutral-50 text-neutral-500 group-hover:border-purple-200 group-hover:from-purple-50 group-hover:to-indigo-50'
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && <span className="absolute inset-x-5 -bottom-[5px] h-[3px] rounded-full bg-gradient-to-r from-primary via-secondary to-accent" aria-hidden="true" />}
                {id === 'messages' && unreadMessages > 0 && !location.pathname.includes('/messages') && (
                  <span className="absolute -right-1 top-0 flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-danger to-rose-500 text-[10px] font-semibold text-neutral-0 shadow-strong">
                    {unreadMessages}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
