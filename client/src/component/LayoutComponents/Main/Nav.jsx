import { useEffect, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { Link } from 'react-router'
import { jwtDecode } from 'jwt-decode'

const Nav = () => {
  const [loginStatus, setLoginstatus] = useState(false)
  const [logedInUser, setLogedInUser] = useState({})

  useEffect(() => {
    const checktoken = () => {
      const token = localStorage.getItem('token')

      if (!token) {
        return setLoginstatus(false)
      }
      const decoded = jwtDecode(token)
      setLogedInUser(decoded)

      return setLoginstatus(true)
    }
    checktoken()
  }, [])

  console.log(logedInUser)

  return (
    <main className="text-md mx-auto max-w-6xl py-4">
      <section className="flex items-center justify-between">
        <div>Logo</div>
        <div className="text-md capitalize">
          <ul className="flex items-center justify-between gap-x-6">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
              <Link to={'/products'}>Products</Link>{' '}
            </li>
            <li>
              {loginStatus ? (
                // go to dashboard

                <Link to={'/overview'} className="flex items-center gap-x-2">
                  <FaRegUserCircle />{' '}
                  <span className="capitalize">{logedInUser.name}</span>
                </Link>
              ) : (
                // not signed in go to AuthPage

                <Link to={'/auth'} className="flex items-center gap-x-2">
                  <FaRegUserCircle /> login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Nav
