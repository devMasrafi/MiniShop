import { Link } from 'react-router'

const Nav = () => {
  return (
    <main className="text-md mx-auto max-w-6xl py-4">
      <section className="flex items-center justify-between">
        <div>Logo</div>
        <div>
          <ul className="flex items-center justify-between gap-x-6">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
              <Link to={'/products'}>Products</Link>{' '}
            </li>
            <li>
              <Link to={'/auth'}>login/signup</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Nav
