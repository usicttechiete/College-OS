import { Bell, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const TopBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center">
      <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-b-3xl border border-transparent border-b-slate-200 bg-white/90 px-4 pb-3 pt-5 backdrop-blur">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-8 text-[var(--color-brand)]" />
          <div>
            <Link to="/home" className="block text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              College Lost &amp; Found
            </Link>
            <p className="text-xs text-[var(--color-muted)]">Trusted returns on campus</p>
          </div>
        </div>
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-brand-foreground)] transition hover:shadow-lg"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-semibold text-white">
            3
          </span>
        </button>
      </div>
    </header>
  )
}

export default TopBar
