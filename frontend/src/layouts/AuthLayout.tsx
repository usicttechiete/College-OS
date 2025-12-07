import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-strong border border-primary/10">
        <div className="absolute -top-28 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 left-4 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
