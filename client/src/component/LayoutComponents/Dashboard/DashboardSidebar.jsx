import { NavLink } from 'react-router'
import Logout from '../../AuthComponents/Logout'

const DashboardSidebar = ({ userData }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-ascent text-white shadow-sm'
        : 'text-inc hover:bg-ascent/10 hover:text-ascent'
    }`

  return (
    <div className="bg-canvas flex h-full w-full flex-col p-4">
      {/* Sidebar heading */}
      <div className="mb-5 px-3">
        <p className="text-muted text-xs font-semibold uppercase tracking-wider">
          Workspace
        </p>
        <p className="text-inc mt-1 truncate text-sm font-semibold capitalize">
          {userData.role} Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {userData.role === 'admin' && (
          <NavLink
            to="/dashboard/overview"
            className={linkClass}
          >
            <span className="text-base">▦</span>
            Overview
          </NavLink>
        )}

        <NavLink to="/dashboard/orders" className={linkClass}>
          <span className="text-base">▤</span>
          Orders
        </NavLink>

        <NavLink to="/dashboard/products" className={linkClass}>
          <span className="text-base">▣</span>
          Products
        </NavLink>

        {userData.role === 'admin' && (
          <NavLink to="/dashboard/users" className={linkClass}>
            <span className="text-base">♙</span>
            Users
          </NavLink>
        )}

        <NavLink
          to="/dashboard/profile-settings"
          className={linkClass}
        >
          <span className="text-base">⚙</span>
          Profile Settings
        </NavLink>
      </nav>

      {/* Logout pinned to the bottom */}
      <div className="border-border mt-auto border-t pt-4">
        <Logout className="flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-inc transition hover:bg-ascent/10 hover:text-ascent" />
      </div>
    </div>
  )
}

export default DashboardSidebar