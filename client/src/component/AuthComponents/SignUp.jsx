/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { apiFetch } from '../../api'

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
      const result = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({
          name: userName.trim(),
          email: userEmail.trim(),
          password: userPassword,
        }),
      })

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
        <p className="text-ascent text-sm font-medium">JOIN MINISHOP</p>
        <h1 className="text-inc mt-2 text-3xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted mt-2 text-sm leading-6">
          Set up your account to get started.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="border-error/20 bg-error/5 text-error mb-4 rounded-lg border px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="signup-name"
            className="text-inc mb-2 block text-sm font-medium"
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
            className="border-border placeholder:text-muted/70 focus:border-ascent focus:ring-ascent/10 w-full rounded-xl border bg-white px-4 py-3 text-sm transition outline-none focus:ring-2"
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
            className="text-inc mb-2 block text-sm font-medium"
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
            className="border-border placeholder:text-muted/70 focus:border-ascent focus:ring-ascent/10 w-full rounded-xl border bg-white px-4 py-3 text-sm transition outline-none focus:ring-2"
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
            className="text-inc mb-2 block text-sm font-medium"
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
            className="border-border placeholder:text-muted/70 focus:border-ascent focus:ring-ascent/10 w-full rounded-xl border bg-white px-4 py-3 text-sm transition outline-none focus:ring-2"
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
            className="text-inc mb-2 block text-sm font-medium"
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
            className="border-border placeholder:text-muted/70 focus:border-ascent focus:ring-ascent/10 w-full rounded-xl border bg-white px-4 py-3 text-sm transition outline-none focus:ring-2"
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
          className="bg-ascent mt-2 rounded-xl px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-muted text-center text-xs leading-5">
          By creating an account, you agree to follow the store's applicable
          terms and policies.
        </p>
      </form>
    </div>
  )
}

export default SignUp
