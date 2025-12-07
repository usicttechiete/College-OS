import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-xl">
        <div className="absolute -top-28 right-0 h-40 w-40 rounded-full bg-[var(--color-brand)]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-4 h-32 w-32 rounded-full bg-[var(--color-brand-foreground)]/10 blur-3xl" />
        <div className="relative">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
