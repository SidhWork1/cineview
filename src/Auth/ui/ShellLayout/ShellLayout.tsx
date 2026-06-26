import { Outlet } from 'react-router-dom'
import Navbar from '../../../Common/components/Navbar'

const ShellLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default ShellLayout
