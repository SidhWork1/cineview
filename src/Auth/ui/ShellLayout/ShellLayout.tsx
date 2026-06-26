import { Outlet } from 'react-router-dom'
import Navbar from '../../../Common/components/Navbar'
import Footer from '../../../Common/components/Footer'

const ShellLayout = () => {
  return (
    <div className="shell-bg min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default ShellLayout