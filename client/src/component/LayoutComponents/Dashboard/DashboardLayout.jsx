import { Link, Outlet } from 'react-router'
import DashboardSidebar from './DashboardSidebar'

const DashboardLayout = () => {
  return (
    <main className="flex h-screen flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="border-border flex shrink-0 items-center justify-between border-b-2 px-4 py-3">
        <div>
          <h2>
            <Link to={'/overview'}>LOGO</Link>
          </h2>
        </div>

        <nav>
          <ul className="flex list-inside list-disc items-center gap-x-4">
            <li className="px-3 py-1">Notification</li>
            <li className="px-3 py-1">Upcoming Events</li>
            <li className="rounded-2xl border px-3 py-1">Check Calendar</li>
          </ul>
        </nav>
      </header>

      {/* Sidebar + Dashboard Content */}
      <div className="flex flex-1">
        <aside className="w-64 overflow-y-auto">
          <DashboardSidebar />
        </aside>

        <section className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default DashboardLayout
