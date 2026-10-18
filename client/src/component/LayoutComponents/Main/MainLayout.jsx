import { Outlet } from 'react-router'
import Nav from './Nav'
import Footer from './Footer'

const MainLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
