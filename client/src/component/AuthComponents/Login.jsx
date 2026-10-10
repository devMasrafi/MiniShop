import { useState } from 'react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'

const Login = () => {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const data = {
      email: userEmail,
      password: userPassword,
    }

    const loginReq = async () => {
      try {
        const loginRes = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(data),
        })
        const result = await loginRes.json()

        // console.log(result)
        if (!loginRes.ok) {
          throw new Error(result.message)
        }

        navigate('/products')
        // console.log(result)
      } catch (error) {
        setError(error.message)
      }
    }
    loginReq()
  }

  return (
    <>
      <div>
        <p className="text-center text-lg text-red-400 capitalize">
          {error !== '' ? `${error}` : ''}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
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
              setError('')
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="cursor-pointer rounded-xl border px-8 py-1">
            login
          </button>
          <Link to={'/forgotpass'}>
            <h2 className="capitalize">forgot password?</h2>
          </Link>
        </div>
      </form>

      <div className="my-7">
        <div className="flex flex-col items-center justify-center gap-y-3">
          <button className="flex cursor-pointer items-center gap-x-2 rounded-xl border px-8 py-1 capitalize">
            <FaGoogle /> login with google
          </button>
          <button className="flex cursor-pointer items-center gap-x-2 rounded-xl border px-8 py-1 capitalize">
            <FaFacebook /> login with facebook
          </button>
        </div>
      </div>
    </>
  )
}

export default Login
