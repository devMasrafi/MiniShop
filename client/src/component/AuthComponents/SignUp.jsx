import { useState } from 'react'
import { Link } from 'react-router'

const SignUp = ({ onSignupSuccess }) => {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userConfirmPassword, setUserConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const checkPass = () => {
    if (userConfirmPassword !== userPassword) {
      setError('Password dose not match')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!checkPass()) {
      return
    }

    // console.log('registering now...')

    const data = {
      name: userName,
      email: userEmail,
      password: userPassword,
    }

    const createUser = async () => {
      try {
        const signUp = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(data),
        })

        const result = await signUp.json()
        // console.log(result)

        if (!signUp.ok) {
          throw new Error(result.message)
        }

        onSignupSuccess()
      } catch (error) {
        setError(error.message)
      }
    }

    createUser()
  }

  return (
    <div>
      <div>
        <p className="text-center text-xl text-red-400 capitalize">
          {error !== '' ? error : ''}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="px-2 py-3">
          <p className="capitalize">user name</p>
          <input
            type="text"
            placeholder="(eg. johns)"
            className="w-full border-b px-2 py-1 outline-none"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
        </div>

        <div className="px-2 py-3">
          <p className="capitalize">User Email</p>
          <input
            type="email"
            placeholder="(eg. johns@mail.com)"
            className="w-full border-b px-2 py-1 outline-none"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value)
              setError('')
            }}
          />
        </div>
        <div className="mt-2 px-2 py-3">
          <p className="capitalize">password</p>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border-b px-2 py-1 outline-none"
            value={userPassword}
            onChange={(e) => {
              setUserPassword(e.target.value)
            }}
          />
        </div>
        <div className="mt-2 px-2 py-3">
          <p className="capitalize">confirm password</p>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border-b px-2 py-1 outline-none"
            value={userConfirmPassword}
            onChange={(e) => {
              setUserConfirmPassword(e.target.value)
              setError('')
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="cursor-pointer rounded-xl border px-8 py-1 capitalize">
            create account
          </button>
          <Link to={'/forgotpass'}>
            <h2 className="capitalize">forgot password?</h2>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignUp
