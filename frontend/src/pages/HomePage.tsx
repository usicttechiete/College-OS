import { Compass, HandHeart, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import WarningBanner from '../components/WarningBanner'
import Button from '../components/ui/Button'
import { mockFoundItems } from '../data/foundItems'
import { mockLostItems } from '../data/lostItems'

const HomePage = () => {
  const navigate = useNavigate()
  const stats = {
    returned: 128,
    activeLost: mockLostItems.filter((item) => item.status === 'open').length,
  }

  const highlights = mockFoundItems.slice(0, 2)

  return (
    <section className="space-y-6">
      <WarningBanner message="False claim leads to ban. Please verify before reclaiming any item." />

      <div className="grid gap-3">
        <Button
          size="lg"
          fullWidth
          iconLeft={<PlusCircle className="size-5" />}
          onClick={() => navigate('/lost/new')}
        >
          Raise a lost query
        </Button>
        <Button
          size="lg"
          variant="secondary"
          fullWidth
          iconLeft={<HandHeart className="size-5" />}
          onClick={() => navigate('/found/new')}
        >
          I found a product
        </Button>
      </div>

      <div className="grid gap-3 rounded-3xl bg-white p-5 shadow-soft">
        <p className="text-sm font-medium text-[var(--color-muted)]">Campus trust barometer</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-[var(--color-surface-muted)] px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Items returned</p>
            <p className="text-3xl font-bold text-[var(--color-brand-foreground)]">{stats.returned}</p>
          </div>
          <div className="rounded-3xl bg-[var(--color-background)] px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Active lost queries</p>
            <p className="text-3xl font-bold text-[var(--color-brand-foreground)]">{stats.activeLost}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-brand-foreground)]">Recent success stories</h2>
            <p className="text-sm text-[var(--color-muted)]">Latest items matched and returned</p>
          </div>
          <Button variant="ghost" size="md" iconRight={<Compass className="size-4" />} onClick={() => navigate('/found')}>
            Explore
          </Button>
        </div>
        <ul className="mt-4 space-y-3">
          {highlights.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-3xl bg-[var(--color-surface-muted)]/80 p-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="size-14 rounded-2xl object-cover"
                loading="lazy"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-brand-foreground)]">{item.title}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  Returned from <span className="font-semibold">{item.location}</span> •{' '}
                  {new Date(item.foundAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HomePage
