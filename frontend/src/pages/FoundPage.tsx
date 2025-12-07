import { useCallback, useEffect, useMemo, useState } from 'react'
import { Filter, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { foundApi, type FoundItem } from '../lib/api'
import ItemCard from '../components/ItemCard'
import Button from '../components/ui/Button'
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

const FoundPage = () => {
  const { session, user } = useAuth()
  const [items, setItems] = useState<FoundItem[]>([])
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    category: 'All',
    location: 'All',
    time: 'Any time',
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [claimingItemId, setClaimingItemId] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null)

  // Convert frontend filters to API query parameters
  const getApiParams = useMemo(() => {
    const params: Record<string, string | number> = {}
    
    if (filters.category !== 'All') {
      params.category = filters.category
    }
    
    if (filters.location !== 'All') {
      params.location = filters.location
    }

    // Time filter is handled on frontend for now (can be moved to backend later)
    // params.sortBy = 'foundAt'
    // params.sortOrder = 'desc'
    
    return params
  }, [filters.category, filters.location])

  // Fetch items function (extracted for reuse)
  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = session?.access_token || null
      const response = await foundApi.getAll(token, getApiParams)

      if (response.success && response.data) {
        let fetchedItems = response.data.items

        // Apply time filter on frontend (can be moved to backend later)
        if (filters.time !== 'Any time') {
          const now = Date.now()
          const oneDay = 1000 * 60 * 60 * 24
          const timeMap: Record<string, number> = {
            'Last 24 hours': oneDay,
            'Last 3 days': oneDay * 3,
            'Last week': oneDay * 7,
          }
          const timeLimit = timeMap[filters.time] ?? Infinity
          
          fetchedItems = fetchedItems.filter((item) => {
            const diff = now - new Date(item.foundAt).getTime()
            return diff <= timeLimit
          })
        }

        setItems(fetchedItems)
      } else {
        setError(response.error || 'Failed to load found items')
        setItems([])
      }
    } catch (err) {
      console.error('Error fetching found items:', err)
      setError('An unexpected error occurred. Please try again.')
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [session, getApiParams, filters.time])

  // Fetch items from API
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

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
  }

  // Handle claim button click
  const handleClaim = async (item: FoundItem) => {
    if (!session?.access_token) {
      setError('You must be logged in to claim an item')
      return
    }

    if (!user) {
      setError('Please log in to claim items')
      return
    }

    // Check if user is trying to claim their own item
    if (item.finderId === user.id) {
      setError('You cannot claim your own found item')
      return
    }

    // Check if item is already claimed
    if (item.status !== 'available') {
      setError('This item is no longer available for claiming')
      return
    }

    setClaimingItemId(item.id)
    setError(null)
    setClaimSuccess(null)

    try {
      const response = await foundApi.claim(session.access_token, item.id)

      if (response.success) {
        setClaimSuccess(`Successfully claimed "${item.title}"! The finder has been notified.`)
        
        // Refresh the items list to show updated status
        await fetchItems()
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setClaimSuccess(null)
        }, 5000)
      } else {
        setError(response.error || 'Failed to claim item. Please try again.')
      }
    } catch (err) {
      console.error('Error claiming item:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setClaimingItemId(null)
    }
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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 text-cyan-700 shadow-soft hover:from-cyan-200 hover:to-teal-200"
            onClick={() => setShowAdvanced(true)}
            aria-label="Open advanced filters"
          >
            <SlidersHorizontal className="size-5" />
          </button>
        </div>
        <p className="text-sm text-neutral-500">
          Swipe left to claim, right to save. {isLoading ? 'Loading...' : `${items.length} results.`}
        </p>
      </header>

      <div className="rounded-[16px] border border-cyan-200/50 bg-white px-4 py-3 shadow-soft">
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
                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 shadow-soft'
                    : 'border-transparent bg-neutral-50 text-neutral-600 shadow-soft hover:bg-cyan-50/50'
                }`}
                aria-pressed={isActive}
              >
                <Filter className="size-3" aria-hidden="true" />
                {chip.label}
                {chip.pill && <span className="rounded-full bg-gradient-to-r from-secondary to-cyan-500 text-[10px] text-white px-1.5 py-0.5 shadow-soft">{chip.pill}</span>}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
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

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {claimSuccess && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {claimSuccess}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <p className="rounded-lg bg-surface-flat px-4 py-6 text-center text-sm text-neutral-500">
            {microcopy.emptyFound}
          </p>
        )}

        <div className="space-y-3">
          {!isLoading &&
            !error &&
            items.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onDetails={() => {}} 
                onClaim={handleClaim} 
                onSave={() => {}} 
                onMessage={() => {}}
                isClaiming={claimingItemId === item.id}
                canClaim={item.status === 'available' && user?.id !== item.finderId}
              />
            ))}
        </div>
      </div>
      {showAdvanced && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-neutral-700/30 backdrop-blur-sm">
          <div className="rounded-t-[20px] bg-white p-5 shadow-strong border-t border-neutral-200/50">
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
                            isActive ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 shadow-soft' : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-cyan-50/50'
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
