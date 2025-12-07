interface WarningBannerProps {
  message: string
}

const WarningBanner = ({ message }: WarningBannerProps) => (
  <div className="mb-4 flex items-center gap-3 rounded-3xl border border-orange-200 bg-orange-50/90 px-4 py-3 text-sm text-orange-700">
    <span className="text-base font-semibold">⚠️</span>
    <p className="flex-1 font-medium leading-snug">{message}</p>
  </div>
)

export default WarningBanner
