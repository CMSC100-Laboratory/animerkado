import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import background from '../../assets/background.png'
import '../../styles/customer/OrderHistory.css'

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  const fetchOrders = () => {
    fetch(`/api/orders?email=${email}`)
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    if (!email) { navigate('/login'); return }
    fetchOrders()
  }, [email, navigate])

  const handleCancel = async (transactionId) => {
    await fetch(`/api/orders/${transactionId}`, { method: 'DELETE' })
    fetchOrders()
  }

  const statusLabel = s => s === 0 ? 'Pending' : s === 1 ? 'Confirmed' : 'Cancelled'
  const statusClass = s => s === 0 ? 'oh-badge-pending' : s === 1 ? 'oh-badge-confirmed' : 'oh-badge-cancelled'

  return (
    <div
      className="oh-wrapper"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >

      {/* Navbar */}
      <nav className="oh-nav">
        <Link to="/" className="oh-nav-logo">
          <img src={logo} alt="Logo" className="oh-nav-logo-img" />
        </Link>
        <div className="oh-nav-right">
          <Link to="/shop" className="oh-nav-link">Shop</Link>
          <Link to="/cart" className="oh-nav-link">Cart</Link>
          <Link to="/orders" className="oh-nav-link active">History</Link>
          <button className="oh-nav-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="oh-main">
        <div className="oh-header">
          <h1 className="oh-title">My Orders</h1>
          <p className="oh-subtitle">Track and manage your purchase history</p>
        </div>

        {loading ? (
          <div className="oh-empty">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="oh-empty">
            <span className="oh-empty-icon">🛒</span>
            <p>No orders yet.</p>
            <Link to="/shop" className="oh-browse-btn">Browse Products</Link>
          </div>
        ) : (
          <div className="oh-table-wrap">
            <table className="oh-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product ID</th>
                  <th>Qty</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.transactionId}>
                    <td className="oh-td-id">#{order.transactionId}</td>
                    <td>{order.productId}</td>
                    <td>{order.orderQuantity}</td>
                    <td>{new Date(order.dateOrdered).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>
                      <span className={`oh-status ${statusClass(order.orderStatus)}`}>
                        {statusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td>
                      {order.orderStatus === 0 && (
                        <button
                          className="oh-cancel-btn"
                          onClick={() => handleCancel(order.transactionId)}
                        >Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="oh-footer">
        <span className="oh-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="oh-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default OrderHistory