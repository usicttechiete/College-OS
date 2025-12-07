interface WarningBannerProps {
  message: string
  onWhy?: () => void
  onReport?: () => void
}

const WarningBanner = ({ message, onWhy, onReport }: WarningBannerProps) => (
  <div className="mb-4 flex items-start gap-3 rounded-[20px] border border-amber-300/60 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 py-3 text-sm text-amber-800 shadow-colored">
    <span className="text-lg" aria-hidden="true">
      ⚠️
    </span>
    <div className="flex flex-1 flex-col gap-2">
      <p className="font-semibold leading-snug">{message}</p>
      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
        <button
          type="button"
          onClick={onWhy}
          className="rounded-full bg-gradient-to-r from-amber-200 to-orange-200 px-3 py-1 transition-all hover:from-amber-300 hover:to-orange-300 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Why?
        </button>
        <button
          type="button"
          onClick={onReport}
          className="rounded-full bg-gradient-to-r from-amber-200 to-orange-200 px-3 py-1 transition-all hover:from-amber-300 hover:to-orange-300 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Report false claim
        </button>
      </div>
    </div>
  </div>
)

export default WarningBanner
