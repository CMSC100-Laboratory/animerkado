import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

// Customer pages (placeholders)
const ShopPage = () => <div>To be implemented</div>
const CartPage = () => <div>To be implemented</div>
const OrderHistoryPage = () => <div>To be implemented</div>
const ProfilePage = () => <div>To be implemented</div>

// Admin pages (placeholders)
const AdminDashboard = () => <div>To be implemented</div>
const AdminUsers = () => <div>To be implemented</div>
const AdminProducts = () => <div>To be implemented</div>
const AdminOrders = () => <div>To be implemented</div>
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
        <Route path="/shop" element={<ProtectedRoute element={<ShopPage />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<CartPage />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<OrderHistoryPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} adminOnly />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} adminOnly />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<AdminProducts />} adminOnly />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<AdminOrders />} adminOnly />} />
        <Route path="/admin/sales" element={<ProtectedRoute element={<SalesReport />} adminOnly />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App