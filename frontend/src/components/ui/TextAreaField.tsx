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
      <span className="font-semibold text-primary">{label}</span>
      <textarea
        rows={rows}
        className={clsx(
          'w-full rounded-2xl border border-neutral-200/60 bg-white px-4 py-3 text-neutral-700 shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10',
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
