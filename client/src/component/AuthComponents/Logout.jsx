import { useNavigate } from 'react-router'
import { RxExit } from 'react-icons/rx'

const Logout = ({ className }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')

    navigate('/products')
  }

  return (
    <div>
      <button
        className={`flex flex-1 cursor-pointer items-center gap-x-2 ${className}`}
        onClick={() => handleLogout()}
      >
        Logout <RxExit />
      </button>
    </div>
  )
}

export default Logout
