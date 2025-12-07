import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface WarningBannerProps {
  message: string
}

const WARNING_BANNER_DISMISSED_KEY = 'warning-banner-dismissed'

const WarningBanner = ({ message }: WarningBannerProps) => {
  const { status } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(WARNING_BANNER_DISMISSED_KEY) === 'true'
    setIsDismissed(dismissed)
  }, [])

  // Reset dismissed state when user logs in again
  useEffect(() => {
    if (status === 'authenticated') {
      const dismissed = localStorage.getItem(WARNING_BANNER_DISMISSED_KEY)
      if (dismissed === 'true') {
        // Reset on login - remove the dismissed flag
        localStorage.removeItem(WARNING_BANNER_DISMISSED_KEY)
        setIsDismissed(false)
      }
    }
  }, [status])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem(WARNING_BANNER_DISMISSED_KEY, 'true')
  }

  if (isDismissed) {
    return null
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-[20px] border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 text-sm text-amber-800 shadow-soft relative">
      <span className="text-lg" aria-hidden="true">
        ⚠️
      </span>
      <div className="flex flex-1 flex-col gap-2">
        <p className="font-semibold leading-snug pr-6">{message}</p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-amber-200/50 text-amber-800 transition-all hover:bg-amber-300/50 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        aria-label="Dismiss warning"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export default WarningBanner
