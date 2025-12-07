import { type TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
}

const TextAreaField = ({ label, hint, error, className, rows = 4, ...props }: TextAreaFieldProps) => {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-neutral-600">
      <span className="font-semibold text-purple-700">{label}</span>
      <textarea
        rows={rows}
        className={clsx(
          'w-full rounded-2xl border border-purple-200/60 bg-gradient-to-br from-white to-purple-50/30 px-4 py-3 text-neutral-700 shadow-soft outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 focus:from-white focus:to-indigo-50/50',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-200',
          className,
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-neutral-500">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  )
}

export default TextAreaField
