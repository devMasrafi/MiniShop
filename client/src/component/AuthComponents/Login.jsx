import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { apiFetch } from '../../api'

const Login = ({ successMessage = '' }) => {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({
          email: userEmail.trim(),
          password: userPassword,
        }),
      })

      if (!result.jwtToken) {
        throw new Error('The server did not return an authentication token.')
      }

      localStorage.setItem('token', result.jwtToken)
      navigate('/products')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-ascent text-sm font-medium">WELCOME BACK</p>
        <h1 className="text-inc mt-2 text-3xl font-bold tracking-tight">
          Log in to MiniShop
        </h1>
        <p className="text-muted mt-2 text-sm leading-6">
          Sign in to continue shopping and manage your account.
        </p>
      </div>

      {successMessage && (
        <p
          role="status"
          className="border-success/20 bg-success/5 text-success mb-4 rounded-lg border px-4 py-3 text-sm"
        >
          {successMessage}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="border-error/20 bg-error/5 text-error mb-4 rounded-lg border px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="login-email"
            className="text-inc mb-2 block text-sm font-medium"
          >
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="border-border placeholder:text-muted/70 focus:border-ascent focus:ring-ascent/10 w-full rounded-xl border bg-white px-4 py-3 text-sm transition outline-none focus:ring-2"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value)
              setError('')
            }}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="text-inc text-sm font-medium"
            >
              Password
            </label>
            <Link
              to="/forgotpass"
              className="text-ascent text-xs font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className="border-border placeholder:text-muted/70 focus:border-ascent focus:ring-ascent/10 w-full rounded-xl border bg-white px-4 py-3 text-sm transition outline-none focus:ring-2"
            value={userPassword}
            onChange={(e) => {
              setUserPassword(e.target.value)
              setError('')
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-ascent mt-1 rounded-xl px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-muted mt-6 text-center text-sm">
        Your first time here?{' '}
        <span className="text-inc font-medium">
          Choose Sign up above to create an account.
        </span>
      </p>
    </div>
  )
}

export default Login
