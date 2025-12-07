import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'surface'

type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary via-secondary to-purple-600 text-primary-foreground shadow-colored transition-transform duration-150 ease-in-out-200 hocus:-translate-y-0.5 hocus:shadow-strong hocus:from-primary-light hocus:via-secondary-light hocus:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  secondary:
    'bg-gradient-to-br from-indigo-50 to-purple-50 text-primary border border-indigo-200 shadow-soft hocus:from-indigo-100 hocus:to-purple-100 hocus:border-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  ghost:
    'bg-transparent text-primary hocus:bg-gradient-to-br hocus:from-purple-50 hocus:to-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  surface:
    'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 shadow-soft hocus:from-emerald-100 hocus:to-teal-100 hocus:border-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all will-change-transform disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {iconLeft && <span className="-ml-1">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="-mr-1">{iconRight}</span>}
    </button>
  )
}

export default Button
