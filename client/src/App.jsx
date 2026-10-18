import { BrowserRouter, Route, Routes } from 'react-router'
import ProductDetails from './component/productComponents/ProductDetails'
import MainLayout from './component/LayoutComponents/Main/MainLayout'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import Products from './pages/Products'
import ForgotPass from './component/AuthComponents/ForgotPass'
import OverView from './pages/DashboardPages/OverView'
import DashboardLayout from './component/LayoutComponents/Dashboard/DashboardLayout'
import DashProduct from './pages/DashboardPages/DashProducts'
import ProductListings from './pages/DashboardPages/ProductListings'
import Orders from './pages/DashboardPages/Orders'
import Inventory from './pages/DashboardPages/Inventory'
import Promotions from './pages/DashboardPages/Promotions'
import ProfileSettings from './pages/DashboardPages/ProfileSettings'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="overview" element={<OverView />} />
            <Route path="products" element={<DashProduct />} />
            <Route path="product-listings" element={<ProductListings />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="profile-settings" element={<ProfileSettings />} />
          </Route>

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgotpass" element={<ForgotPass />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
