import { Link, Navigate, NavLink, Outlet } from 'react-router'
import { getUser, isStaff } from '../../utils/auth'
import Logout from '../../component/AuthComponents/Logout'

const CustomerAccountLayout = () => {
  const user = getUser()

  if (!user) return <Navigate to="/auth" replace />
  if (isStaff(user)) return <Navigate to="/dashboard" replace />
  if (user.role !== 'customer') return <Navigate to="/products" replace />

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-ascent text-white shadow-sm'
        : 'text-inc hover:bg-ascent/10 hover:text-ascent'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-ascent text-white' : 'text-inc hover:bg-ascent/10'
    }`

  return (
    <main className="bg-canvas text-inc flex h-dvh flex-col overflow-hidden">
      {/* Top bar */}
      <header className="border-border flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white px-4 sm:px-6 lg:px-8">
        <Link to="/account" className="flex items-center gap-3">
          <span className="bg-ascent flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white">
            M
          </span>
          <span className="text-lg font-bold tracking-tight">
            MiniShop
            <span className="text-muted ml-2 hidden text-xs font-normal sm:inline">
              Customer Account
            </span>
          </span>
        </Link>

        <Link
          to="/products"
          className="border-border hover:border-ascent hover:bg-ascent rounded-lg border px-3 py-2 text-sm font-medium transition hover:text-white sm:px-4"
        >
          <span className="hidden sm:inline">Continue Shopping</span>
          <span className="sm:hidden">Shop</span>
        </Link>
      </header>

      {/* Main shell */}
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">
        {/* Desktop sidebar */}
        <aside className="border-border hidden w-60 shrink-0 flex-col rounded-2xl border bg-white p-4 lg:flex">
          <div className="mb-5 px-3">
            <p className="text-muted text-xs font-semibold tracking-wider uppercase">
              Your Account
            </p>
            <p className="mt-1 truncate text-sm font-semibold">
              {user.name || user.username || 'Customer'}
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            <NavLink to="/account" end className={linkClass}>
              <span className="text-base">▦</span>
              Overview
            </NavLink>

            <NavLink to="/account/orders" className={linkClass}>
              <span className="text-base">▤</span>
              My Orders
            </NavLink>

            <NavLink to="/account/settings" className={linkClass}>
              <span className="text-base">⚙</span>
              Profile Settings
            </NavLink>
          </nav>

          <div className="border-border mt-auto border-t pt-4">
            <Logout className="text-inc hover:bg-ascent/10 hover:text-ascent flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition" />
          </div>
        </aside>

        {/* Content column */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Mobile account navigation */}
          <nav className="border-border flex shrink-0 gap-2 overflow-x-auto rounded-xl border bg-white p-2 lg:hidden">
            <NavLink to="/account" end className={mobileLinkClass}>
              Overview
            </NavLink>
            <NavLink to="/account/orders" className={mobileLinkClass}>
              My Orders
            </NavLink>
            <NavLink to="/account/settings" className={mobileLinkClass}>
              Settings
            </NavLink>
            <div className="ml-auto shrink-0">
              <Logout className="text-inc hover:bg-ascent/10 rounded-lg px-3 py-2.5 text-sm font-medium" />
            </div>
          </nav>

          {/* Scrollable page content; scrollbar hidden but scrolling remains */}
          <section className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </section>
        </div>
      </div>
    </main>
  )
}

export default CustomerAccountLayout
