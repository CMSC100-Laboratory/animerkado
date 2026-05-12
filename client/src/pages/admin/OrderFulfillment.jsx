import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/admin/OrderFulfillment.css'

function OrderFulfillment() {
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const navigate = useNavigate()

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => { applyFilters() }, [orders, search, sortField, sortDir])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      //default sort is newest first
      const sorted = [...data].sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered))
      setOrders(sorted)
    } catch (err) { console.error('Failed to fetch orders:', err) }
  }

  const applyFilters = () => {
    let result = [...orders]
    if (search) {
      result = result.filter(o =>
        o.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.productId?.toLowerCase().includes(search.toLowerCase()) ||
        o.transactionId?.toLowerCase().includes(search.toLowerCase())
      )
    }
    result.sort((a, b) => {
      let valA, valB
      if (sortField === 'date') { valA = new Date(a.dateOrdered); valB = new Date(b.dateOrdered) }
      else if (sortField === 'quantity') { valA = a.orderQuantity; valB = b.orderQuantity }
      else if (sortField === 'status') { valA = a.orderStatus; valB = b.orderStatus }
      return sortDir === 'asc' ? valA - valB : valB - valA
    })
    setFiltered(result)
  }

  const handleSort = (field) => {
    if (sortField === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const sortIndicator = (field) => {
    if (sortField !== field) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  const handleConfirm = async (transactionId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/orders/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderStatus: 1 })
      })
      fetchOrders()
    } catch (err) { console.error('Failed to confirm order:', err) }
  }

  const handleCancel = async (transactionId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/orders/${transactionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOrders()
    } catch (err) { console.error('Failed to cancel order:', err) }
  }

  const handleLogout = () => { localStorage.clear(); navigate('/login') }

  const statusLabel = (status) => {
    if (status === 0) return 'PENDING'
    if (status === 1) return 'CONFIRMED'
    if (status === 2) return 'CANCELED'
    return 'UNKNOWN'
  }

  const formatDate = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (d) => {
    const date = new Date(d)
    return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="orders-wrapper">

      {/* ── NAVIGATION BAR ── */}
      <nav className="orders-nav">
        <Link to="/admin/dashboard" className="orders-nav-logo">
          <img src={logo} alt="Logo" className="orders-nav-logo-img" />
        </Link>
        <div className="orders-nav-right">
          <Link to="/admin/dashboard" className="orders-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="orders-nav-link">Products</Link>
          <Link to="/admin/sales" className="orders-nav-link">Sales</Link>
          <Link to="/admin/users" className="orders-nav-link">Users</Link>
          <button className="orders-logout-btn" onClick={handleLogout}>Log Out ✕</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="orders-main">
        <h1 className="orders-heading">Orders</h1>

        {/* SEARCH */}
        <div className="orders-search-row">
          <input
            type="text"
            className="orders-search-input"
            placeholder="Search by product, customer, or order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* SORT PILLS */}
        <div className="orders-sort-row">
          <span className="orders-sort-label">Sort:</span>
          {[
            { key: 'date', label: 'Date' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'status', label: 'Status' },
          ].map(s => (
            <button
              key={s.key}
              className={`orders-sort-pill${sortField === s.key ? ' orders-sort-pill--active' : ''}`}
              onClick={() => handleSort(s.key)}
            >
              {s.label}{sortIndicator(s.key)}
            </button>
          ))}
        </div>

        {/* ORDERS PANEL */}
        <div className="orders-panel">
          <div className="orders-panel-header">
            <span className="orders-panel-title">Orders ({filtered.length})</span>
          </div>

          <table className="orders-table">
            <thead>
              <tr className="orders-table-head-row">
                <th className="orders-table-head">Product</th>
                <th className="orders-table-head">Customer</th>
                <th className="orders-table-head" onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                  Quantity{sortIndicator('quantity')}
                </th>
                <th className="orders-table-head" onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                  Date{sortIndicator('date')}
                </th>
                <th className="orders-table-head">Time</th>
                <th className="orders-table-head" onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  Status{sortIndicator('status')}
                </th>
                <th className="orders-table-head">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.transactionId} className="orders-table-row">
                  <td className="orders-table-cell" style={{ fontWeight: 600 }}>{order.productId}</td>
                  <td className="orders-table-cell" style={{ color: '#4a7a3a' }}>{order.email}</td>
                  <td className="orders-table-cell">{order.orderQuantity}</td>
                  <td className="orders-table-cell">{formatDate(order.dateOrdered)}</td>
                  <td className="orders-table-cell" style={{ color: '#4a7a3a' }}>{formatTime(order.dateOrdered)}</td>
                  <td className="orders-table-cell">
                    <span className={`orders-status orders-status-${order.orderStatus}`}>
                      {statusLabel(order.orderStatus)}
                    </span>
                  </td>
                  <td className="orders-table-cell">
                    {order.orderStatus === 0 && (
                      <div className="orders-action-btns">
                        <button className="orders-confirm-btn" onClick={() => handleConfirm(order.transactionId)}>
                          Confirm
                        </button>
                        <button className="orders-cancel-btn" onClick={() => handleCancel(order.transactionId)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#4a7a3a', fontSize: '0.9rem' }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── FOOTER ── */}
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