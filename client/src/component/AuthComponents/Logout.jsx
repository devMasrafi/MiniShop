import { useNavigate } from 'react-router'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')

    navigate('/products')
  }

  return (
    <div>
      <button className="bg-amber-300 px-5 py-2" onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  )
}

export default Logout
