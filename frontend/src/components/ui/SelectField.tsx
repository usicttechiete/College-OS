import { type SelectHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
}

const SelectField = ({ label, hint, className, children, ...props }: SelectFieldProps) => {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-neutral-600">
      <span className="font-semibold text-primary">{label}</span>
      <select
        className={clsx(
          'h-11 w-full rounded-2xl border border-neutral-200/60 bg-white px-4 text-neutral-700 shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {hint && <span className="text-xs text-neutral-500">{hint}</span>}
    </label>
  )
}

export default SelectField
