
import { useState } from 'react'

const SignUp = ({ onSignupSuccess }) => {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userConfirmPassword, setUserConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (userPassword !== userConfirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (userPassword.length < 8) {
      setError('Your password must be at least 8 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      const signUp = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName.trim(),
          email: userEmail.trim(),
          password: userPassword,
        }),
      })

      const result = await signUp.json().catch(() => ({}))

      if (!signUp.ok) {
        throw new Error(result.message || 'Unable to create your account.')
      }

      onSignupSuccess()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-sm font-medium text-ascent">JOIN MINISHOP</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-inc">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Set up your account to get started.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="signup-name"
            className="mb-2 block text-sm font-medium text-inc"
          >
            Your name
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-ascent focus:ring-2 focus:ring-ascent/10"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value)
              setError('')
            }}
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-2 block text-sm font-medium text-inc"
          >
            Email address
          </label>
          <input
            id="signup-email"
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
          <label
            htmlFor="signup-password"
            className="mb-2 block text-sm font-medium text-inc"
          >
            Password
          </label>
          <input
            id="signup-password"
            name="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-ascent focus:ring-2 focus:ring-ascent/10"
            value={userPassword}
            onChange={(e) => {
              setUserPassword(e.target.value)
              setError('')
            }}
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm-password"
            className="mb-2 block text-sm font-medium text-inc"
          >
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Enter your password again"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-ascent focus:ring-2 focus:ring-ascent/10"
            value={userConfirmPassword}
            onChange={(e) => {
              setUserConfirmPassword(e.target.value)
              setError('')
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-xl bg-ascent px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-center text-xs leading-5 text-muted">
          By creating an account, you agree to follow the store's applicable
          terms and policies.
        </p>
      </form>
    </div>
  )
}

export default SignUp
