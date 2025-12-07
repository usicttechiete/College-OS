import { type TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
}

const TextAreaField = ({ label, hint, error, className, rows = 4, ...props }: TextAreaFieldProps) => {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-[var(--color-muted)]">
      <span className="font-semibold text-[var(--color-brand-foreground)]">{label}</span>
      <textarea
        rows={rows}
        className={clsx(
          'w-full rounded-2xl border border-slate-200 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-brand-foreground)] shadow-sm outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/20',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-200',
          className,
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-[var(--color-muted)]">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  )
}

export default TextAreaField
