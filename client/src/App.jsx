import { BrowserRouter, Route, Routes } from 'react-router'
import ProductDetails from './component/productComponents/ProductDetails'
import MainLayout from './component/LayoutComponents/MainLayout'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import Products from './pages/Products'
import ForgotPass from './component/AuthComponents/ForgotPass'

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

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgotpass" element={<ForgotPass />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
