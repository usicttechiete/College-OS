import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 px-4 py-12">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 p-8 shadow-colored border border-purple-200/50">
        <div className="absolute -top-28 right-0 h-40 w-40 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 opacity-30 blur-3xl" />
        <div className="absolute -bottom-24 left-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink-300 to-rose-300 opacity-10 blur-2xl" />
        <div className="relative">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
