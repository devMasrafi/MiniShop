import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { jwtDecode } from 'jwt-decode'
import { FaBars, FaRegUserCircle, FaShoppingBag, FaTimes } from 'react-icons/fa'

const Nav = () => {
  const [loginStatus, setLoginStatus] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoginStatus(false)
        setLoggedInUser(null)
        return
      }

      try {
        const decoded = jwtDecode(token)

        //  check JWT expiry.
        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
          localStorage.removeItem('token')
          setLoginStatus(false)
          setLoggedInUser(null)
          return
        }

        setLoggedInUser(decoded)
        setLoginStatus(true)
      } catch {
        localStorage.removeItem('token')
        setLoginStatus(false)
        setLoggedInUser(null)
      }
    }

    checkToken()

    // Recheck when another tab updates authentication.
    window.addEventListener('storage', checkToken)

    return () => {
      window.removeEventListener('storage', checkToken)
    }
  }, [])

  const navLinkClass = ({ isActive }) =>
    `transition-colors hover:text-ascent ${
      isActive ? 'font-semibold text-ascent' : 'text-inc'
    }`

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setLoginStatus(false)
    setLoggedInUser(null)
    setMenuOpen(false)
    navigate('/')
  }

  const displayName =
    loggedInUser?.name || loggedInUser?.username || 'My account'

  return (
    <header className="border-border sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-ascent flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight"
          aria-label="MiniShop home"
        >
          <span className="bg-ascent flex h-9 w-9 items-center justify-center rounded-xl text-white">
            <FaShoppingBag className="text-base" />
          </span>
          <span>MiniShop</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
        </div>

        {/* Desktop account */}
        <div className="hidden items-center gap-4 md:flex">
          {loginStatus ? (
            <>
              <Link
                to="/dashboard/overview"
                className="text-inc hover:bg-canvas hover:text-ascent flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
              >
                <FaRegUserCircle className="text-ascent text-lg" />
                <span className="max-w-32 truncate">{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="border-border text-inc hover:border-ascent hover:text-ascent rounded-lg border px-4 py-2 text-sm font-medium transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-inc hover:text-ascent rounded-lg px-4 py-2 text-sm font-medium transition"
              >
                Log in
              </Link>

              <Link
                to="/auth"
                className="bg-ascent rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="border-border text-inc hover:bg-canvas flex h-10 w-10 items-center justify-center rounded-lg border transition md:hidden"
          aria-label={
            menuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-border border-t bg-white px-5 py-5 sm:px-8 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-ascent/10 text-ascent'
                    : 'text-inc hover:bg-canvas'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-ascent/10 text-ascent'
                    : 'text-inc hover:bg-canvas'
                }`
              }
            >
              Products
            </NavLink>

            <div className="border-border my-2 border-t" />

            {loginStatus ? (
              <>
                <Link
                  to="/dashboard/overview"
                  onClick={closeMenu}
                  className="text-inc hover:bg-canvas flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium"
                >
                  <FaRegUserCircle className="text-ascent text-lg" />
                  <span>{displayName}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="border-border hover:border-ascent hover:text-ascent rounded-lg border px-4 py-3 text-left text-sm font-medium"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={closeMenu}
                  className="hover:bg-canvas rounded-lg px-4 py-3 text-sm font-medium"
                >
                  Log in
                </Link>

                <Link
                  to="/auth"
                  onClick={closeMenu}
                  className="bg-ascent rounded-lg px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Nav
