import { LogOut, Moon, Sun } from 'lucide-react'
import Button from '../components/ui/Button'
import { mockFoundItems } from '../data/foundItems'
import { mockLostItems } from '../data/lostItems'
import { useAuth } from '../context/AuthContext'

const AccountPage = () => {
  const { user, logout } = useAuth()
  const lostCount = mockLostItems.filter((item) => item.status !== 'closed').length
  const foundCount = mockFoundItems.filter((item) => item.status !== 'returned').length

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-white p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl}
            alt={user?.name}
            className="size-16 rounded-3xl object-cover shadow-soft"
          />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Trust score</p>
            <p className="text-3xl font-bold text-[var(--color-brand-foreground)]">{user?.trustScore ?? 0}</p>
            <p className="text-sm text-[var(--color-muted)]">{user?.name}</p>
            <p className="text-xs text-[var(--color-muted)]">{user?.email}</p>
          </div>
          <Button variant="ghost" iconLeft={<LogOut className="size-4" />} onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-[var(--color-surface-muted)] px-4 py-5 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Active lost queries</p>
          <p className="text-2xl font-semibold text-[var(--color-brand-foreground)]">{lostCount}</p>
        </div>
        <div className="rounded-3xl bg-white px-4 py-5 text-center shadow-soft">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Active found posts</p>
          <p className="text-2xl font-semibold text-[var(--color-brand-foreground)]">{foundCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">My lost queries</h2>
        <div className="space-y-3">
          {mockLostItems.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-[var(--color-brand-foreground)]">{item.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">{item.location}</p>
                </div>
                <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-muted)]">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">My found posts</h2>
        <div className="space-y-3">
          {mockFoundItems.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-[var(--color-brand-foreground)]">{item.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">{item.location}</p>
                </div>
                <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-muted)]">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-[var(--color-brand-foreground)]">Preferences</h2>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-muted)] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-foreground)]">Theme</p>
            <p className="text-xs text-[var(--color-muted)]">Dark mode coming soon</p>
          </div>
          <Button variant="ghost" iconLeft={<Moon className="size-4" />} iconRight={<Sun className="size-4" />}
            className="text-[var(--color-muted)]">
            Toggle
          </Button>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
