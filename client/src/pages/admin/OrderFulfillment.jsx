import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/admin/OrderFulfillment.css'

function OrderFulfillment() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  const handleConfirm = async (transactionId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/orders/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: 1 })
      })
      fetchOrders()
    } catch (err) {
      console.error('Failed to confirm order:', err)
    }
  }

  const handleCancel = async (transactionId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/orders/${transactionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOrders()
    } catch (err) {
      console.error('Failed to cancel order:', err)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const statusLabel = (status) => {
    if (status === 0) return 'PENDING'
    if (status === 1) return 'CONFIRMED'
    if (status === 2) return 'CANCELED'
    return 'UNKNOWN'
  }

  return (
    <div className="orders-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="orders-nav">
        <Link to="/admin/dashboard" className="orders-nav-logo">
          <img src={logo} alt="Logo" className="orders-nav-logo-img" />
        </Link>
        <button className="orders-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="orders-main">
        <h1 className="orders-heading">ORDERS</h1>

        {/* ORDERS TABLE */}
        <div className="orders-panel">
          <div className="orders-panel-header">
            <span className="orders-panel-title">ORDERS ({orders.length})</span>
          </div>

          <table className="orders-table">
            <thead>
              <tr className="orders-table-head-row">
                <th className="orders-table-head">Product</th>
                <th className="orders-table-head">Customer</th>
                <th className="orders-table-head">Quantity</th>
                <th className="orders-table-head">Date</th>
                <th className="orders-table-head">Status</th>
                <th className="orders-table-head">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.transactionId} className="orders-table-row">
                  <td className="orders-table-cell">{order.productId}</td>
                  <td className="orders-table-cell">{order.email}</td>
                  <td className="orders-table-cell">{order.orderQuantity}</td>
                  <td className="orders-table-cell">{new Date(order.dateOrdered).toLocaleDateString()}</td>
                  <td className="orders-table-cell">
                    <span className={`orders-status orders-status-${order.orderStatus}`}>
                      {statusLabel(order.orderStatus)}
                    </span>
                  </td>
                  <td className="orders-table-cell">
                    {order.orderStatus === 0 && (
                      <div className="orders-action-btns">
                        <button
                          className="orders-confirm-btn"
                          onClick={() => handleConfirm(order.transactionId)}
                        >Confirm</button>
                        <button
                          className="orders-cancel-btn"
                          onClick={() => handleCancel(order.transactionId)}
                        >Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="orders-footer">
        <span className="orders-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="orders-footer-links">
          <Link to="/privacy" className="orders-footer-link">Privacy</Link>
          <Link to="/terms" className="orders-footer-link">Terms</Link>
          <Link to="/contact" className="orders-footer-link">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default OrderFulfillment