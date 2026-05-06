import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
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
  }, [])

  const handleCancel = async (transactionId) => {
    await fetch(`/api/orders/${transactionId}`, { method: 'DELETE' })
    fetchOrders()
  }

  const statusLabel = s => s === 0 ? 'Pending' : s === 1 ? 'Confirmed' : 'Cancelled'
  const statusClass = s => s === 0 ? 'oh-badge-pending' : s === 1 ? 'oh-badge-confirmed' : 'oh-badge-cancelled'

  return (
    <div className="oh-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="oh-nav">
        <Link to="/" className="oh-nav-logo">
          <img src={logo} alt="Logo" className="oh-nav-logo-img" />
        </Link>
        <div className="oh-nav-right">
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
          <button className="oh-nav-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            Log Out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="oh-main">
        <h1 className="oh-title">MY ORDERS</h1>

        {loading ? (
          <div className="oh-empty">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="oh-empty">
            No orders yet. <Link to="/shop">Browse products</Link>
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
                    <td>{order.transactionId}</td>
                    <td>{order.productId}</td>
                    <td>{order.orderQuantity}</td>
                    <td>{new Date(order.dateOrdered).toLocaleDateString()}</td>
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

      {/* FOOTER */}
      <footer className="oh-footer">
        <span className="oh-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="oh-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>

    </div>
  )
}

export default OrderHistory