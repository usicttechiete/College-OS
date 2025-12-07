import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonSize = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-brand)] text-white shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
  secondary:
    'bg-[var(--color-surface-muted)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
  ghost:
    'bg-transparent text-[var(--color-brand-foreground)] hover:bg-[var(--color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
}

const sizeStyles: Record<ButtonSize, string> = {
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
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-65',
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
