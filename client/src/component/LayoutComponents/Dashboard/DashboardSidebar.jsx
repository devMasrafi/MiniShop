import { Link } from 'react-router'
import Logout from '../../AuthComponents/Logout'

const DashboardSidebar = ({ userData }) => {
  return (
    <main className="bg-canvas h-full w-64 px-5 py-3">
      <div className="flex flex-col gap-y-3 text-lg capitalize">
        {userData.role === 'admin' && (
          <Link to="/dashboard/overview">Overview</Link>
        )}
        <Link to="/dashboard/orders">Orders</Link>
        <Link to="/dashboard/products">Products</Link>

        {userData.role === 'admin' && <Link to="/dashboard/users">Users</Link>}

        <Link to="/dashboard/profile-settings">Profile Settings</Link>

        <Logout />
      </div>
    </main>
  )
}

export default DashboardSidebar
