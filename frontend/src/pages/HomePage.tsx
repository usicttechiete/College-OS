import { useEffect, useMemo, useState } from 'react'
import { Compass, HandHeart, MapPin, PlusCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import WarningBanner from '../components/WarningBanner'
import Button from '../components/ui/Button'
import { mockFoundItems } from '../data/foundItems'
import { mockLostItems } from '../data/lostItems'
import { microcopy } from '../copy'

const animateCounter = (target: number, setValue: (value: number) => void) => {
  let frame: number
  const duration = 800
  const start = performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2
    setValue(Math.round(target * eased))
    if (progress < 1) {
      frame = requestAnimationFrame(tick)
    }
  }

  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}

const HomePage = () => {
  const navigate = useNavigate()
  const [returnedCount, setReturnedCount] = useState(0)
  const [activeLostCount, setActiveLostCount] = useState(0)

  const stats = useMemo(
    () => ({
      returned: 128,
      activeLost: mockLostItems.filter((item) => item.status === 'open').length,
    }),
    [],
  )

  const highlights = useMemo(() => mockFoundItems.slice(0, 5), [])

  useEffect(() => animateCounter(stats.returned, setReturnedCount), [stats.returned])
  useEffect(() => animateCounter(stats.activeLost, setActiveLostCount), [stats.activeLost])

  return (
    <section className="space-y-6 pb-28">
      <WarningBanner message={microcopy.warningBanner} />

      <div className="grid gap-3">
        <Button
          size="lg"
          fullWidth
          iconLeft={<PlusCircle className="size-5" />}
          className="bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-soft hocus:from-primary-light hocus:via-accent-light hocus:to-secondary-light"
          onClick={() => navigate('/lost/new')}
        >
          {microcopy.homeRaiseLost}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          fullWidth
          iconLeft={<HandHeart className="size-5" />}
          className="bg-gradient-to-br from-cyan-50 to-teal-50 text-cyan-700 border border-cyan-200 hocus:from-cyan-100 hocus:to-teal-100"
          onClick={() => navigate('/found/new')}
        >
          {microcopy.homeFoundCTA}
        </Button>
      </div>

      <div className="rounded-[20px] bg-white p-5 shadow-soft border border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-3" aria-hidden="true" /> Campus trust barometer
            </p>
            <h2 className="mt-1 text-lg font-semibold text-neutral-700">Trust-first community stats</h2>
          </div>
          <ShieldCheck className="size-6 text-primary" aria-hidden="true" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[16px] bg-gradient-to-br from-success to-success-dark text-primary-foreground px-4 py-5 text-center shadow-soft">
            <p className="flex items-center justify-center gap-1 text-[11px] uppercase tracking-[0.26em]">Returned</p>
            <p className="text-3xl font-bold" aria-live="polite">
              {returnedCount}
            </p>
            <span className="text-xs opacity-90">Verified handovers</span>
          </div>
          <div className="rounded-[16px] bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-5 text-center shadow-soft border border-indigo-200/50">
            <p className="flex items-center justify-center gap-1 text-[11px] uppercase tracking-[0.26em] text-indigo-700">Active lost</p>
            <p className="text-3xl font-bold text-indigo-700" aria-live="polite">
              {activeLostCount}
            </p>
            <span className="text-xs text-indigo-600">Need your eyes</span>
          </div>
        </div>
      </div>

      <section aria-labelledby="success-reels" className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 id="success-reels" className="text-lg font-semibold text-neutral-700">
              {microcopy.successStoryTitle}
            </h2>
            <p className="text-sm text-neutral-500">Latest verified matches and returns</p>
          </div>
          <Button variant="ghost" size="sm" iconRight={<Compass className="size-4" />} onClick={() => navigate('/found')}>
            Explore
          </Button>
        </div>
        <div className="flex snap-x gap-4 overflow-x-auto px-4 pb-2 scroll-container">
          {highlights.map((item) => (
            <article
              key={item.id}
              className="snap-start rounded-[20px] bg-white p-4 shadow-soft min-w-[240px] border border-secondary/20"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="size-14 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-neutral-700 line-clamp-2">{item.title}</p>
                  <p className="flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="size-3" aria-hidden="true" /> {item.location}
                  </p>
                  <p className="text-xs text-success font-semibold">Returned on {new Date(item.foundAt).toLocaleDateString()}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 rounded-[20px] bg-white px-4 py-5 shadow-soft border border-amber-200/50">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Trusted helpers spotlight</h3>
        <div className="flex items-center gap-3 rounded-[16px] bg-amber-50/50 px-4 py-3 shadow-soft border border-amber-200/50">
          <img
            src={mockFoundItems[0].finder.avatarUrl}
            alt={mockFoundItems[0].finder.name}
            className="size-12 rounded-full object-cover"
          />
          <div className="flex-1 text-sm text-neutral-500">
            <p className="text-base font-semibold text-neutral-700">{mockFoundItems[0].finder.name}</p>
            <p>Helped return 5 items this month — keep the kindness rolling!</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/account')}>See profile</Button>
        </div>
      </section>

    </section>
  )
}

export default HomePage
