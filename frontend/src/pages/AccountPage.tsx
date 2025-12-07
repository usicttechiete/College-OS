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
      <header className="rounded-3xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-5 shadow-colored border border-purple-200/50">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl}
            alt={user?.name}
            className="size-16 rounded-3xl object-cover shadow-colored ring-2 ring-purple-200/50"
          />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-purple-600">Trust score</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{user?.trustScore ?? 0}</p>
            <p className="text-sm text-neutral-700 font-semibold">{user?.name}</p>
            <p className="text-xs text-neutral-600">{user?.email}</p>
          </div>
          <Button variant="ghost" iconLeft={<LogOut className="size-4" />} onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-5 text-center border border-blue-200/50 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-blue-600">Active lost queries</p>
          <p className="text-2xl font-semibold text-blue-700">{lostCount}</p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-5 text-center shadow-colored border border-emerald-200/50">
          <p className="text-xs uppercase tracking-wide text-emerald-600">Active found posts</p>
          <p className="text-2xl font-semibold text-emerald-700">{foundCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-600">My lost queries</h2>
        <div className="space-y-3">
          {mockLostItems.map((item) => (
            <div key={item.id} className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 shadow-soft border border-indigo-200/50">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-purple-700">{item.title}</p>
                  <p className="text-xs text-neutral-600">{item.location}</p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700 border border-blue-200">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">My found posts</h2>
        <div className="space-y-3">
          {mockFoundItems.map((item) => (
            <div key={item.id} className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-soft border border-emerald-200/50">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-emerald-700">{item.title}</p>
                  <p className="text-xs text-neutral-600">{item.location}</p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700 border border-emerald-200">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-5 shadow-colored border border-amber-200/50">
        <h2 className="text-lg font-semibold text-amber-700">Preferences</h2>
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-white to-amber-50/50 px-4 py-3 border border-amber-200/50">
          <div>
            <p className="text-sm font-semibold text-amber-700">Theme</p>
            <p className="text-xs text-neutral-600">Dark mode coming soon</p>
          </div>
          <Button variant="ghost" iconLeft={<Moon className="size-4" />} iconRight={<Sun className="size-4" />}
            className="text-amber-700">
            Toggle
          </Button>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
