import { ArrowRight, BookmarkPlus, Clock3, HandHeart, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'
import Button from './ui/Button'
import type { FoundItem } from '../types'

interface ItemCardProps {
  item: FoundItem
  onDetails?: (item: FoundItem) => void
  onClaim?: (item: FoundItem) => void
  onSave?: (item: FoundItem) => void
  onMessage?: (item: FoundItem) => void
}

const statusStyles: Record<FoundItem['status'], string> = {
  available: 'bg-gradient-to-r from-emerald-50 to-cyan-50 text-success-dark border border-emerald-200',
  matched: 'bg-gradient-to-r from-cyan-50 to-teal-50 text-secondary-dark border border-cyan-200',
  returned: 'bg-gradient-to-br from-neutral-100 to-neutral-50 text-neutral-500 border border-neutral-200',
  'verification-pending': 'bg-gradient-to-r from-amber-50 to-orange-50 text-warning-dark border border-amber-200',
  open: 'bg-gradient-to-r from-indigo-50 to-purple-50 text-accent-dark border border-indigo-200',
  closed: 'bg-gradient-to-br from-neutral-100 to-neutral-50 text-neutral-500 border border-neutral-200',
}

const ItemCard = ({ item, onDetails, onClaim, onSave, onMessage }: ItemCardProps) => {
  const date = new Date(item.foundAt)
  const formatted = date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className="group relative grid grid-cols-[104px_1fr] gap-3 overflow-hidden rounded-lg bg-white p-3 shadow-soft border border-cyan-200/50 transition-all duration-150 ease-in-out-200 hocus:-translate-y-0.5">
      <div className="relative overflow-hidden rounded-md">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full min-h-[128px] object-cover"
          loading="lazy"
        />
        {item.verification.verified ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-success to-success-dark px-2 py-1 text-[10px] font-semibold uppercase text-white shadow-soft">
            <ShieldCheck className="size-3" /> Verified
          </span>
        ) : (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-warning to-warning-dark px-2 py-1 text-[10px] font-semibold uppercase text-white shadow-soft">
            Check proof
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{item.category}</p>
            <h3 className="text-base font-semibold text-neutral-700 line-clamp-2">{item.title}</h3>
          </div>
          <span
            className={clsx(
              'rounded-full px-3 py-1 text-[11px] font-semibold capitalize',
              statusStyles[item.status],
            )}
          >
            {item.status.replace('-', ' ')}
          </span>
        </header>

        <p className="line-clamp-2 text-sm text-neutral-500">{item.description}</p>

        <dl className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-secondary" aria-hidden="true" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Clock3 className="size-4 text-neutral-500" aria-hidden="true" />
            <span>{formatted}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-accent" aria-hidden="true" />
            <span>{item.distanceMinutes} mins away</span>
          </div>
          <div className="flex items-center gap-2 justify-end text-success">
            <HandHeart className="size-4" aria-hidden="true" />
            <span className="font-semibold">{item.verification.matchConfidence}% match</span>
          </div>
        </dl>

        <div className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2 border border-neutral-200/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span
                className={`absolute inset-0 rounded-full border-[3px] ${
                  item.finder.isTrustedHelper ? 'border-success' : 'border-secondary'
                } animate-[progress_0.4s_ease-out]`}
                aria-hidden="true"
              />
              <img src={item.finder.avatarUrl} alt={`${item.finder.name} avatar`} className="size-9 rounded-full object-cover" />
            </div>
            <div className="text-xs text-neutral-600">
              <p className="font-semibold text-neutral-700">{item.finder.name}</p>
              <p>
                Trust {item.finder.trustScore}
                {item.finder.isTrustedHelper && <span className="ml-1 inline-flex items-center gap-1 text-success font-semibold">• Trusted Helper</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSave?.(item)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-700 shadow-soft transition-transform duration-150 ease-in-out-200 hocus:-translate-y-0.5"
              aria-label={`Save ${item.title}`}
            >
              <BookmarkPlus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onMessage?.(item)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-700"
              aria-label={`Message about ${item.title}`}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button
            variant="primary"
            size="sm"
            iconLeft={<HandHeart className="size-4" />}
            onClick={() => onClaim?.(item)}
            aria-label={`Claim ${item.title}`}
          >
            Claim
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconRight={<ArrowRight className="size-4" />}
            onClick={() => onDetails?.(item)}
            aria-label={`View details for ${item.title}`}
          >
            Details
          </Button>
        </div>
      </div>
    </article>
  )
}

export default ItemCard
