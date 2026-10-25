import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './component/LayoutComponents/Main/MainLayout'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import Products from './pages/Products'
import ForgotPass from './component/AuthComponents/ForgotPass'
import OverView from './pages/DashboardPages/OverView'
import DashboardLayout from './component/LayoutComponents/Dashboard/DashboardLayout'
import Product from './pages/DashboardPages/Product'
import Orders from './pages/DashboardPages/Orders'
import Users from './pages/DashboardPages/Users'
import ProfileSettings from './pages/DashboardPages/ProfileSettings'
import ProductDetails from './pages/ProductDetails'
import DashboardHome from './component/LayoutComponents/Dashboard/DashboardHome'
import RequireRole from './utils/requiredRole'

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
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Product />} />
            <Route path="profile-settings" element={<ProfileSettings />} />

            <Route element={<RequireRole roles={['admin']} />}>
              <Route path="overview" element={<OverView />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Route>

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgotpass" element={<ForgotPass />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
