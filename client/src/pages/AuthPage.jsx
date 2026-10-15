import { useState } from 'react'
import { Link } from 'react-router'
import Login from '../component/AuthComponents/Login'
import SignUp from '../component/AuthComponents/SignUp'
import { FaAngleLeft } from 'react-icons/fa'

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [signupComplete, setSignupComplete] = useState(false)

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to={'/products'}
        className="my-5 flex items-center gap-x-4 px-10 capitalize"
      >
        <FaAngleLeft /> go back{' '}
      </Link>
      <div className="flex justify-around rounded-3xl bg-gray-400 p-15">
        <div className="my-auto rounded-xl bg-white p-5">
          {/* account created login message*/}
          <div className="mx-auto max-w-60 text-center text-lg text-gray-500">
            {signupComplete ? 'Account Creation Successfull!! Login now' : ''}
          </div>
          {/* forum selector and components */}
          <div className="my-2 flex w-90 justify-around rounded-2xl bg-gray-500 py-2">
            <button
              className={`cursor-pointer px-10 py-1 ${isSignUp ? 'text-gray-300' : 'rounded-xl bg-white '}`}
              onClick={() => {
                setIsSignUp(false)
              }}
            >
              Log in
            </button>
            <button
              className={`cursor-pointer px-10 py-1 ${isSignUp ? 'rounded-xl bg-white ' : 'text-gray-300'}`}
              onClick={() => {
                setIsSignUp(true)
                setSignupComplete(false)
              }}
            >
              Sign up
            </button>
          </div>
          {isSignUp ? (
            <SignUp
              onSignupSuccess={() => {
                setIsSignUp(false)
                setSignupComplete(true)
              }}
            />
          ) : (
            <Login />
          )}
        </div>
        <div>
          <img
            className="h-120 w-100 rounded-2xl"
            src="https://static.vecteezy.com/system/resources/thumbnails/069/468/149/small/wooden-log-slices-for-product-display-free-photo.jpg"
            alt="wooden log slices"
          />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
