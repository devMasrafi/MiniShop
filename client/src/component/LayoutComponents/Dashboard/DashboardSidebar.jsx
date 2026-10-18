import { Link } from 'react-router'

import Logout from '../../AuthComponents/Logout'

const DashboardSidebar = () => {
  return (
    <main className="bg-canvas h-full w-64 px-5 py-3">
      <div className="cap flex flex-col gap-y-3 text-lg capitalize">
        <Link to="/dashboard/overview">overview</Link>
        <Link to="/dashboard/inventory">Inventory</Link>
        <Link to="/dashboard/orders">Orders</Link>
        <Link to="/dashboard/products">Products</Link>
        <Link to="/dashboard/product-listings">Product Listings</Link>
        <Link to="/dashboard/promotions">Promotions</Link>
        <Link to="/dashboard/profile-settings">Profile Settings</Link>
        <Logout />
      </div>
    </main>
  )
}

export default DashboardSidebar
