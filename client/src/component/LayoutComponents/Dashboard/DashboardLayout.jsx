import { Link, Navigate, Outlet } from 'react-router'
import DashboardSidebar from './DashboardSidebar'
import { getUser, isStaff } from '../../../utils/auth'

const DashboardLayout = () => {
  const userData = getUser()

  if (!userData) {
    return <Navigate to="/auth" replace />
  }

  if (!isStaff(userData)) {
    return <Navigate to="/products" replace />
  }

  return (
    <main className="bg-canvas text-foreground flex h-dvh flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="border-border bg-canvas flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="text-lg font-bold tracking-tight">
          MiniShop
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            Dashboard
          </span>
        </Link>

        <Link
          to="/products"
          className="border-border hover:bg-ascent text-inc rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:text-white"
        >
          Back to Shop
        </Link>
      </header>

      {/* Sidebar + Dashboard Content */}
      <div className="flex min-h-0 flex-1">
        <aside className="border-border w-56 shrink-0 overflow-y-auto border-r sm:w-64">
          <DashboardSidebar userData={userData} />
        </aside>

        <section className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet context={userData} />
        </section>
      </div>
    </main>
  )
}

export default DashboardLayout
