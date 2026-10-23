import { useState } from 'react'
import { Link } from 'react-router'
import { FaAngleLeft, FaShoppingBag } from 'react-icons/fa'
import Login from '../component/AuthComponents/Login'
import SignUp from '../component/AuthComponents/SignUp'

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [signupComplete, setSignupComplete] = useState(false)

  const handleSignupSuccess = () => {
    setIsSignUp(false)
    setSignupComplete(true)
  }

  const handleModeChange = (signingUp) => {
    setIsSignUp(signingUp)
    setSignupComplete(false)
  }

  return (
    <main className="bg-canvas min-h-[75vh] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="text-muted hover:text-ascent mb-6 inline-flex items-center gap-2 text-sm font-medium transition"
        >
          <FaAngleLeft />
          Back to shopping
        </Link>

        <section className="border-border flex overflow-hidden rounded-3xl border bg-white shadow-sm">
          {/* Form section */}
          <div className="flex w-full flex-col p-6 sm:p-10 lg:w-1/2 lg:p-12">
            <Link
              to="/"
              className="text-ascent mb-8 inline-flex w-fit items-center gap-2 text-lg font-bold"
            >
              <FaShoppingBag />
              MiniShop
            </Link>

            <div className="bg-canvas mb-8 flex rounded-xl p-1">
              <button
                type="button"
                onClick={() => handleModeChange(false)}
                aria-pressed={!isSignUp}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  !isSignUp
                    ? 'text-ascent bg-white shadow-sm'
                    : 'text-muted hover:text-inc'
                }`}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => handleModeChange(true)}
                aria-pressed={isSignUp}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isSignUp
                    ? 'text-ascent bg-white shadow-sm'
                    : 'text-muted hover:text-inc'
                }`}
              >
                Sign up
              </button>
            </div>

            {isSignUp ? (
              <SignUp onSignupSuccess={handleSignupSuccess} />
            ) : (
              <Login
                successMessage={
                  signupComplete
                    ? 'Your account was created successfully. You can now log in.'
                    : ''
                }
              />
            )}
          </div>

          {/*desktop only */}
          <aside className="bg-ascent relative hidden flex-1 flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-12">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/10" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                Everyday essentials
              </span>

              <h2 className="mt-8 max-w-sm text-4xl leading-tight font-bold xl:text-5xl">
                Good things for your everyday life.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">
                Discover useful, thoughtfully selected products for your home
                and daily routine.
              </p>
            </div>

            <div className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-medium">A simpler way to shop</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Browse products and manage your account in one place.
              </p>
            </div>
          </aside>
        </section>

        <p className="text-muted mt-6 text-center text-xs">
          Secure access to your MiniShop account
        </p>
      </div>
    </main>
  )
}

export default AuthPage
