/* eslint-disable no-unused-vars */
import { Link, Navigate, Outlet } from 'react-router'
import DashboardSidebar from './DashboardSidebar'
import { jwtDecode } from 'jwt-decode'

const DashboardLayout = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/auth" replace />
  }

  let userData

  try {
    userData = jwtDecode(token)
  } catch (error) {
    localStorage.removeItem('token')
    return <Navigate to="/auth" replace />
  }

  if (userData.role !== 'admin' && userData.role !== 'employee') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="border-border bg-canvas flex shrink-0 items-center justify-between border-b-2 px-4 py-3">
        <div>
          <h2>
            <Link to="/dashboard/overview">LOGO</Link>
          </h2>
        </div>

        <nav>
          <ul className="flex list-inside list-disc items-center gap-x-4">
            <li className="px-3 py-1">Check Calendar</li>
            <li className="px-3 py-1">Upcoming Events</li>
            <li className="rounded-2xl border px-3 py-1">
              <Link to="/products">Back To Shop</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sidebar + Dashboard Content */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 overflow-y-auto">
          <DashboardSidebar userData={userData} />
        </aside>

        <section className="flex-1 overflow-y-auto p-4">
          <Outlet context={userData} />
        </section>
      </div>
    </main>
  )
}

export default DashboardLayout
