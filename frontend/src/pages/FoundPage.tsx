import { useMemo, useState } from 'react'
import { Filter, RefreshCw, SlidersHorizontal } from 'lucide-react'
import ItemCard from '../components/ItemCard'
import Button from '../components/ui/Button'
import { mockFoundItems } from '../data/foundItems'
import type { FoundItem } from '../types'
import { microcopy } from '../copy'

type FilterKey = 'category' | 'time' | 'location'

const quickFilters: { id: string; label: string; pill?: string; filter: Partial<Record<FilterKey, string>> }[] = [
  { id: 'recent', label: 'Recent 24h', pill: '24h', filter: { time: 'Last 24 hours' } },
  { id: 'electronics', label: 'Electronics', filter: { category: 'Electronics' } },
  { id: 'bags', label: 'Bags', filter: { category: 'Bags' } },
  { id: 'library', label: 'Library', filter: { location: 'Library' } },
  { id: 'trusted', label: 'Trusted helpers', filter: {} },
  { id: 'desk', label: 'Desk submissions', filter: {} },
]

const advancedFilters: Record<FilterKey, string[]> = {
  category: ['All', 'Bags', 'Electronics', 'Keys', 'Accessories', 'Books', 'ID Cards'],
  time: ['Any time', 'Last 24 hours', 'Last 3 days', 'Last week'],
  location: ['All', 'Library', 'Cafeteria', 'Computer Lab', 'Main Auditorium', 'Innovation Center'],
}

const applyFilters = (items: FoundItem[], filters: Record<FilterKey, string>) => {
  const now = Date.now()
  return items.filter((item) => {
    const matchesCategory = filters.category === 'All' || item.category === filters.category
    const matchesLocation = filters.location === 'All' || item.location.includes(filters.location)

    let matchesTime = true
    if (filters.time !== 'Any time') {
      const diff = now - new Date(item.foundAt).getTime()
      const oneDay = 1000 * 60 * 60 * 24
      const timeMap: Record<string, number> = {
        'Last 24 hours': oneDay,
        'Last 3 days': oneDay * 3,
        'Last week': oneDay * 7,
      }
      matchesTime = diff <= (timeMap[filters.time] ?? Infinity)
    }

    return matchesCategory && matchesLocation && matchesTime
  })
}

const FoundPage = () => {
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    category: 'All',
    location: 'All',
    time: 'Any time',
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredItems = useMemo(() => applyFilters(mockFoundItems, filters), [filters])

  const toggleFilter = (chipId: string) => {
    const chip = quickFilters.find((item) => item.id === chipId)
    if (!chip) return

    setFilters((prev) => ({
      ...prev,
      ...chip.filter,
    }))
  }

  const resetFilters = () => {
    setFilters({ category: 'All', location: 'All', time: 'Any time' })
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 200)
  }

  return (
    <section className="space-y-6 pb-24">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Browse & claim responsibly</p>
            <h1 className="text-2xl font-semibold text-neutral-700">Found items</h1>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 shadow-soft hover:from-purple-200 hover:to-indigo-200"
            onClick={() => setShowAdvanced(true)}
            aria-label="Open advanced filters"
          >
            <SlidersHorizontal className="size-5" />
          </button>
        </div>
        <p className="text-sm text-neutral-500">
          Swipe left to claim, right to save. {filteredItems.length} results.
        </p>
      </header>

      <div className="rounded-[16px] border border-purple-200/50 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 px-4 py-3 shadow-soft">
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-container">
          {quickFilters.map((chip) => {
            const isActive = Object.entries(chip.filter).every(([key, value]) => value && filters[key as FilterKey] === value)
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleFilter(chip.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border-purple-400 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-colored'
                    : 'border-transparent bg-gradient-to-br from-white to-neutral-50 text-neutral-600 shadow-soft hover:from-purple-50 hover:to-indigo-50'
                }`}
                aria-pressed={isActive}
              >
                <Filter className="size-3" aria-hidden="true" />
                {chip.label}
                {chip.pill && <span className="rounded-full bg-gradient-to-r from-primary to-secondary text-[10px] text-primary-foreground px-1.5 py-0.5 shadow-soft">{chip.pill}</span>}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-br from-white to-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:from-indigo-50 hover:to-purple-50"
          >
            <SlidersHorizontal className="size-3" aria-hidden="true" /> More
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="space-y-3" aria-live="polite">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex animate-pulse gap-3 rounded-lg bg-surface-raised p-4 shadow-soft">
                <div className="h-28 w-24 rounded-md bg-neutral-100" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/5 rounded bg-neutral-100" />
                  <div className="h-3 w-2/3 rounded bg-neutral-100" />
                  <div className="h-3 w-1/2 rounded bg-neutral-100" />
                  <div className="flex gap-2">
                    <span className="h-9 w-20 rounded bg-neutral-100" />
                    <span className="h-9 w-16 rounded bg-neutral-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <p className="rounded-lg bg-surface-flat px-4 py-6 text-center text-sm text-neutral-500">
            {microcopy.emptyFound}
          </p>
        )}

        <div className="space-y-3">
          {!isLoading &&
            filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onDetails={() => {}} onClaim={() => {}} onSave={() => {}} onMessage={() => {}} />
            ))}
        </div>
      </div>
      {showAdvanced && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-purple-900/30 backdrop-blur-sm">
          <div className="rounded-t-[20px] bg-gradient-to-b from-white via-purple-50/50 to-indigo-50/50 p-5 shadow-strong border-t border-purple-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-700">Advanced filters</h2>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-flat text-neutral-500"
                onClick={() => setShowAdvanced(false)}
                aria-label="Close advanced filters"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {Object.entries(advancedFilters).map(([key, values]) => (
                <div key={key}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{key}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {values.map((value) => {
                      const isActive = filters[key as FilterKey] === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              [key]: value,
                            }))
                          }
                          className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                            isActive ? 'border-purple-400 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-soft' : 'border-neutral-200 bg-gradient-to-br from-white to-neutral-50 text-neutral-600 hover:from-purple-50 hover:to-indigo-50'
                          }`}
                          aria-pressed={isActive}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" fullWidth onClick={resetFilters} iconLeft={<RefreshCw className="size-4" />}>
                Reset
              </Button>
              <Button variant="primary" fullWidth onClick={() => setShowAdvanced(false)}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default FoundPage
