
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

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
      const loginRes = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail.trim(),
          password: userPassword,
        }),
      })

      const result = await loginRes.json().catch(() => ({}))

      if (!loginRes.ok) {
        throw new Error(result.message || 'Unable to log in. Please try again.')
      }

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
        <p className="text-sm font-medium text-ascent">WELCOME BACK</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-inc">
          Log in to MiniShop
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Sign in to continue shopping and manage your account.
        </p>
      </div>

      {successMessage && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm text-success"
        >
          {successMessage}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-inc"
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
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-ascent focus:ring-2 focus:ring-ascent/10"
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
              className="text-sm font-medium text-inc"
            >
              Password
            </label>
            <Link
              to="/forgotpass"
              className="text-xs font-medium text-ascent hover:underline"
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
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-ascent focus:ring-2 focus:ring-ascent/10"
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
          className="mt-1 rounded-xl bg-ascent px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Your first time here?{' '}
        <span className="font-medium text-inc">
          Choose Sign up above to create an account.
        </span>
      </p>
    </div>
  )
}

export default Login
