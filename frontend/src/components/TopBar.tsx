import { Bell, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const TopBar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [isCondensed, setIsCondensed] = useState(false)
  const unreadCount = 3

  useEffect(() => {
    const handleScroll = () => {
      setIsCondensed(window.scrollY > 12)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const region = document.getElementById('notification-live-region')
    if (region) {
      region.textContent = unreadCount > 0 ? `${unreadCount} new notifications` : 'All caught up'
    }
  }, [unreadCount, location.pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-sticky,40)] flex justify-center px-4">
      <div
        className={`flex w-full max-w-md items-center justify-between gap-3 rounded-b-[20px] border border-purple-200/50 bg-gradient-to-r from-purple-50/95 via-blue-50/95 to-indigo-50/95 px-4 shadow-colored backdrop-blur-md transition-all duration-200 ease-in-out-200 ${
          isCondensed ? 'py-3' : 'py-4'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-soft">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <Link to="/home" className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
              College Lost &amp; Found
            </Link>
            <p className="flex items-center gap-1 text-xs text-neutral-500">
              <Sparkles className="size-3" aria-hidden="true" />
              Trusted returns on campus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 transition-transform duration-150 ease-in-out-200 hocus:-translate-y-0.5 hocus:shadow-colored"
            aria-label={unreadCount ? `Notifications (${unreadCount} unread)` : 'Notifications'}
          >
            <Bell className="size-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-danger to-rose-500 text-neutral-0 text-[10px] font-bold shadow-strong">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 shadow-soft transition-transform duration-150 ease-in-out-200 hocus:-translate-y-0.5 ring-2 ring-emerald-200/50"
            aria-label={`Open account menu for ${user?.name ?? 'your account'}`}
          >
            <img
              src={user?.avatarUrl}
              alt={user?.name ?? 'User avatar'}
              className="size-11 rounded-full object-cover"
              loading="lazy"
            />
          </button>
        </div>
      </div>
      <span id="notification-live-region" className="sr-only" aria-live="polite" />
    </header>
  )
}

export default TopBar
