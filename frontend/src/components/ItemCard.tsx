import { ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import Button from './ui/Button'
import type { FoundItem } from '../types'

interface ItemCardProps {
  item: FoundItem
  onDetails?: (item: FoundItem) => void
}

const statusStyles: Record<FoundItem['status'], string> = {
  available: 'bg-emerald-50 text-emerald-700',
  matched: 'bg-amber-50 text-amber-700',
  returned: 'bg-slate-100 text-slate-500',
  open: 'bg-blue-50 text-blue-600',
  closed: 'bg-slate-200 text-slate-500',
}

const ItemCard = ({ item, onDetails }: ItemCardProps) => {
  return (
    <article className="grid grid-cols-[96px_1fr] gap-3 overflow-hidden rounded-3xl bg-white shadow-sm">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="aspect-[3/4] w-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-col gap-3 p-4 pr-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{item.category}</p>
            <h3 className="text-base font-semibold text-[var(--color-brand-foreground)]">{item.title}</h3>
          </div>
          <span
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold capitalize',
              statusStyles[item.status],
            )}
          >
            {item.status}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-[var(--color-muted)]">{item.description}</p>
        <div className="mt-auto space-y-2 text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--color-brand)]" />
            {item.location}
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--color-muted)]" />
            {new Date(item.foundAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          iconRight={<ArrowRight className="size-4" />}
          onClick={() => onDetails?.(item)}
        >
          View details
        </Button>
      </div>
    </article>
  )
}

export default ItemCard
