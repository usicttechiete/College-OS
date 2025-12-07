import { useMemo, useState } from 'react'
import { Filter, RefreshCw } from 'lucide-react'
import ItemCard from '../components/ItemCard'
import Button from '../components/ui/Button'
import SelectField from '../components/ui/SelectField'
import { mockFoundItems } from '../data/foundItems'
import type { FoundItem } from '../types'

const categories = ['All', 'Bags', 'Electronics', 'Keys', 'Accessories']
const locations = ['All', 'Library', 'Cafeteria', 'Computer Lab', 'Main Auditorium', 'Innovation Center']
const timeFilters = ['Any time', 'Last 24 hours', 'Last 3 days', 'Last week']

const applyFilters = (
  items: FoundItem[],
  {
    category,
    location,
    time,
  }: {
    category: string
    location: string
    time: string
  },
) => {
  const now = Date.now()
  return items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    const matchesLocation = location === 'All' || item.location.includes(location)

    let matchesTime = true
    if (time !== 'Any time') {
      const diff = now - new Date(item.foundAt).getTime()
      const oneDay = 1000 * 60 * 60 * 24
      const timeMap: Record<string, number> = {
        'Last 24 hours': oneDay,
        'Last 3 days': oneDay * 3,
        'Last week': oneDay * 7,
      }
      matchesTime = diff <= (timeMap[time] ?? Infinity)
    }

    return matchesCategory && matchesLocation && matchesTime
  })
}

const FoundPage = () => {
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    time: 'Any time',
  })

  const filteredItems = useMemo(() => applyFilters(mockFoundItems, filters), [filters])

  const resetFilters = () => setFilters({ category: 'All', location: 'All', time: 'Any time' })

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-brand-foreground)]">Found items</h1>
          <p className="text-sm text-[var(--color-muted)]">Browse campus-wide posts and claim responsibly.</p>
        </div>
        <Filter className="size-6 text-[var(--color-brand)]" />
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-soft">
        <div className="grid gap-4">
          <SelectField
            label="Category"
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Place"
            value={filters.location}
            onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Time"
            value={filters.time}
            onChange={(event) => setFilters((prev) => ({ ...prev, time: event.target.value }))}
          >
            {timeFilters.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </SelectField>
          <Button variant="ghost" size="md" iconLeft={<RefreshCw className="size-4" />} onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length === 0 && (
          <p className="rounded-3xl bg-[var(--color-surface-muted)]/60 px-4 py-6 text-center text-sm text-[var(--color-muted)]">
            No items match these filters yet. Try adjusting your search or raise a lost query from the home page.
          </p>
        )}

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FoundPage
