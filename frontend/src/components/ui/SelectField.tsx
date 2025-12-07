import { type SelectHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
}

const SelectField = ({ label, hint, className, children, ...props }: SelectFieldProps) => {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-neutral-600">
      <span className="font-semibold text-purple-700">{label}</span>
      <select
        className={clsx(
          'h-11 w-full rounded-2xl border border-purple-200/60 bg-gradient-to-br from-white to-purple-50/30 px-4 text-neutral-700 shadow-soft outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 focus:from-white focus:to-indigo-50/50',
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
