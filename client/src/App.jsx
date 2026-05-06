import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import LandingPage from './pages/default/LandingPage'
import LoginPage from './pages/default/LoginPage'
import RegisterPage from './pages/customer/RegisterPage'
import './App.css'

// Customer pages
import Shop from './pages/customer/Shop'
import Cart from './pages/customer/Cart'
import ProductDetail from './pages/customer/ProductDetail'
import OrderConfirmation from './pages/customer/OrderConfirmation'
import OrderHistory from './pages/customer/OrderHistory'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import ProductListings from './pages/admin/ProductListings'
import OrderFulfillment from './pages/admin/OrderFulfillment'
import SalesReport from './pages/admin/SalesReport'

// Route guard
const ProtectedRoute = ({ element, adminOnly = false }) => {
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  if (!token) return <Navigate to="/login" />
  if (adminOnly && userType !== 'admin') return <Navigate to="/shop" />
  return element
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer routes */}
        <Route path="/shop" element={<ProtectedRoute element={<Shop />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/product/:productId" element={<ProtectedRoute element={<ProductDetail />} />} />
        <Route path="/order-confirmation" element={<ProtectedRoute element={<OrderConfirmation />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<OrderHistory />} />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} adminOnly />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<UserManagement />} adminOnly />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<ProductListings />} adminOnly />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<OrderFulfillment />} adminOnly />} />
        <Route path="/admin/sales" element={<ProtectedRoute element={<SalesReport />} adminOnly />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App