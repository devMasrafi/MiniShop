import { Link } from 'react-router'
import DashProduct from '../../../pages/DashboardPages/DashProducts'
import Inventory from '../../../pages/DashboardPages/Inventory'
import OverView from '../../../pages/DashboardPages/OverView'
import ProductListings from '../../../pages/DashboardPages/ProductListings'
import ProfileSettings from '../../../pages/DashboardPages/ProfileSettings'
import Promotions from '../../../pages/DashboardPages/Promotions'
import Logout from '../../AuthComponents/Logout'
import Orders from '../../../pages/DashboardPages/Orders'

const DashboardSidebar = () => {
  return (
    <main className="h-full w-64 px-5 bg-canvas py-3">
      <div className="text-lg flex flex-col gap-y-3">
        <Link to={'/overview'}>{<OverView />}</Link>
        <Link to={'/dashproducts'}>
          <DashProduct />
        </Link>
        <Link to={'/orders'}>
          <Orders />
        </Link>
        <Link to={'/inventory'}>
          <Inventory />
        </Link>
        <Link to={'/productlistings'}>
          <ProductListings />
        </Link>
        <Link to={'/promotions'}>
          <Promotions />
        </Link>
        <Link to={'/profilesettings'}>
          <ProfileSettings />
        </Link>
        <Logout />
      </div>
    </main>
  )
}

export default DashboardSidebar
