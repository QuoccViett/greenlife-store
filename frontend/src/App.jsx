import { Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import PaymentResultPage from './pages/PaymentResultPage'
import AdminSidebar from './components/admin/AdminSidebar'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import LearnPage from './pages/LearnPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'


const MainLayout = ({ children }) => (
  <div className='min-h-screen flex flex-col'>
    <Navbar />
    <main className='flex-1'>{children}</main>
    <Footer />
  </div>
)

const AuthLayout = ({ children }) => (
  <div className='min-h-screen'>{children}</div>
)

const AdminLayout = ({ children }) => (
  <div className="h-screen bg-gray-50 flex">
    <AdminSidebar />

    <div className="flex-1 min-w-0 overflow-y-auto">{children}</div>
  </div>
)


function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1'>
        <Routes>

          <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
          <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
          <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/order-success/:id" element={<MainLayout><OrderSuccessPage /></MainLayout>} />
          <Route path="/payment-result" element={<MainLayout><PaymentResultPage /></MainLayout>} />
          <Route path="/learn" element={<MainLayout><LearnPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

          <Route path='/admin' element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path='/admin/products' element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
