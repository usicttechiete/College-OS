import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'

const authRoutes = ['/login', '/signup']

const AppLayout = () => {
  const location = useLocation()
  const hideChrome = authRoutes.includes(location.pathname)

  return (
    <div className="flex min-h-screen w-full justify-center bg-neutral-50 md:bg-white text-neutral-700 dark:bg-neutral-50 md:dark:bg-white">
      <div className="flex w-full max-w-md flex-col bg-neutral-50 md:bg-neutral-50">
        {!hideChrome && <TopBar />}
        <main className="flex flex-1 flex-col px-4 pb-28 pt-24">
          <Outlet />
        </main>
        {!hideChrome && <BottomNav />}
      </div>
    </div>
  )
}

export default AppLayout
