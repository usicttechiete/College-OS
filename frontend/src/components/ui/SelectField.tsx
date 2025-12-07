import { type SelectHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
}

const SelectField = ({ label, hint, className, children, ...props }: SelectFieldProps) => {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-[var(--color-muted)]">
      <span className="font-semibold text-[var(--color-brand-foreground)]">{label}</span>
      <select
        className={clsx(
          'h-11 w-full rounded-2xl border border-slate-200 bg-[var(--color-surface)] px-4 text-[var(--color-brand-foreground)] shadow-sm outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {hint && <span className="text-xs text-[var(--color-muted)]">{hint}</span>}
    </label>
  )
}

export default SelectField
