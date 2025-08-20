import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {showSidebar && (
          <div>
            <Sidebar />
          </div>
        )}
        <main className="flex-1 overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
