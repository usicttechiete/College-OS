import { LayoutDashboard, Inbox, MessageCircle, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', icon: LayoutDashboard, to: '/home' },
  { label: 'Found', icon: Inbox, to: '/found' },
  { label: 'Messages', icon: MessageCircle, to: '/messages' },
  { label: 'Account', icon: User, to: '/account' },
]

const BottomNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="mb-4 flex h-16 w-full max-w-md items-center justify-around rounded-3xl border border-slate-200 bg-white/95 px-3 pb-2 pt-3 shadow-sm backdrop-blur">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl px-3 py-1 text-xs font-medium transition-colors ${
                isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-muted)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex size-10 items-center justify-center rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[var(--color-brand)] text-white shadow-lg'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)]'
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
