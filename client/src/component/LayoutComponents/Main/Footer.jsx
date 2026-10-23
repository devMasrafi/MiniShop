import { Link } from 'react-router'
import { FaShoppingBag } from 'react-icons/fa'
import { jwtDecode } from 'jwt-decode'

const getloggedInUser = () => {
  const token = localStorage.getItem('token')

  if (!token) return null

  try {
    const decodedToken = jwtDecode(token)

    if (decodedToken.exp && decodedToken.exp * 1000 <= Date.now()) {
      localStorage.removeItem('token')
      return null
    }

    return decodedToken
  } catch {
    localStorage.removeItem('token')
    return null
  }
}

const Footer = () => {
  const loggedInUser = getloggedInUser()

  return (
    <footer className="border-border bg-canvas mt-16 border-t">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-10 px-5 py-12 sm:px-8">
        <div className="w-full sm:max-w-60">
          <Link
            to="/"
            className="text-ascent inline-flex items-center gap-2 text-xl font-bold"
          >
            <FaShoppingBag />
            <span>MiniShop</span>
          </Link>

          <p className="text-muted mt-4 text-sm leading-6">
            Everyday essentials, thoughtfully selected for your home and
            everyday life.
          </p>
        </div>

        <div className="min-w-32">
          <h2 className="text-inc mb-4 text-sm font-semibold">Explore</h2>
          <div className="text-muted flex flex-col gap-3 text-sm">
            <Link className="hover:text-ascent transition" to="/">
              Home
            </Link>
            <Link className="hover:text-ascent transition" to="/products">
              All products
            </Link>
          </div>
        </div>

        <div className="min-w-32">
          <h2 className="text-inc mb-4 text-sm font-semibold">Your account</h2>
          <div className="text-muted flex flex-col gap-3 text-sm">
            <Link className="hover:text-ascent transition" to="/auth">
              Log in
            </Link>
            <Link className="hover:text-ascent transition" to="/auth">
              Create an account
            </Link>

            <Link
              className="hover:text-ascent transition"
              to={loggedInUser ? '/dashboard' : '/auth'}
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="min-w-32">
          <h2 className="text-inc mb-4 text-sm font-semibold">Help</h2>
          <div className="text-muted flex flex-col gap-3 text-sm">
            <span>Shipping information</span>
            <span>Returns policy</span>
            <span>Customer support</span>
          </div>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="text-muted mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs sm:px-8">
          <p>© {new Date().getFullYear()} MiniShop. All rights reserved.</p>
          <p>Simple shopping. Everyday essentials.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
