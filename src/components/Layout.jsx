import { Outlet } from 'react-router-dom'
import BackToTopButton from './BackToTopButton'
import Footer from './Footer'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="site-shell">
      <Navbar />
      <Outlet />
      <Footer />
      <BackToTopButton />
    </div>
  )
}

export default Layout
