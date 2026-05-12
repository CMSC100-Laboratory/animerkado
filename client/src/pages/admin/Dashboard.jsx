import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import logo from '../../assets/logo.png'
import '../../styles/admin/Dashboard.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Dashboard() {
  const [userCount, setUserCount] = useState(0)
  const [productCounts, setProductCounts] = useState({ total: 0, crops: 0, poultry: 0 })
  const [orderCounts, setOrderCounts] = useState({ total: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [salesRows, setSalesRows] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
    fetchProducts()
    fetchOrders()
    fetchSales()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setUserCount(data.total || 0)
    } catch (err) { console.error('Failed to fetch users:', err) }
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/products', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      const crops = data.filter(p => p.productType === 1).length
      const poultry = data.filter(p => p.productType === 2).length
      setProductCounts({ total: data.length, crops, poultry })
    } catch (err) { console.error('Failed to fetch products:', err) }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      const pending = data.filter(o => o.orderStatus === 0).length
      setOrderCounts({ total: data.length, pending })
      const sorted = [...data].sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered))
      setRecentOrders(sorted.slice(0, 5))
    } catch (err) { console.error('Failed to fetch orders:', err) }
  }

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/orders/sales?filter=weekly', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setSalesRows(data.report || [])
    } catch (err) { console.error('Failed to fetch sales:', err) }
  }

  const handleLogout = () => { localStorage.clear(); navigate('/login') }

  const statusLabel = (status) => {
    if (status === 0) return 'PENDING'
    if (status === 1) return 'CONFIRMED'
    if (status === 2) return 'CANCELED'
    return 'UNKNOWN'
  }

  const chartData = {
    labels: salesRows.map(r => r._id),
    datasets: [{
      label: 'Revenue (₱)',
      data: salesRows.map(r => r.totalRevenue),
      backgroundColor: 'rgba(7, 102, 83, 0.55)',
      borderColor: '#076653',
      borderWidth: 1,
      borderRadius: 6,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(106,158,73,0.1)' } },
      x: { grid: { display: false } }
    }
  }

  return (
    <div className="dashboard-wrapper">

      {/* ── NAVIGATION BAR ── */}
      <nav className="dashboard-nav">
        <Link to="/admin/dashboard" className="dashboard-nav-logo">
          <img src={logo} alt="Logo" className="dashboard-nav-logo-img" />
        </Link>
        <div className="dashboard-nav-right">
          <Link to="/admin/products" className="dashboard-nav-link">Products</Link>
          <Link to="/admin/orders" className="dashboard-nav-link">Orders</Link>
          <Link to="/admin/sales" className="dashboard-nav-link">Sales</Link>
          <Link to="/admin/users" className="dashboard-nav-link">Users</Link>
          <button className="dashboard-logout-btn" onClick={handleLogout}>Log Out ✕</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="dashboard-main">
        <h1 className="dashboard-heading">Admin Dashboard</h1>
        <p className="dashboard-subheading">
          This dashboard provides an overview of the Farm to Table e-commerce platform,
          including product listings, customer orders, sales reports, and registered user accounts.
        </p>

        {/* SUMMARY CARDS */}
        <div className="dashboard-summary-row">

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-label">Registered Users</span>
              <Link to="/admin/users" className="dashboard-card-link">View List →</Link>
            </div>
            <div className="dashboard-card-count">{userCount}</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-label">Listed Products</span>
              <Link to="/admin/products" className="dashboard-card-link">View List →</Link>
            </div>
            <div className="dashboard-card-count">{productCounts.total}</div>
            <div className="dashboard-card-sub">
              {productCounts.crops} Crops &nbsp;·&nbsp; {productCounts.poultry} Poultry
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-label">Orders</span>
              <Link to="/admin/orders" className="dashboard-card-link">View List →</Link>
            </div>
            <div className="dashboard-card-count">{orderCounts.total}</div>
            <div className="dashboard-card-sub">{orderCounts.pending} pending confirmation</div>
          </div>

        </div>

        {/* RECENT ORDERS + WEEKLY SALES */}
        <div className="dashboard-mid-row">

          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <span className="dashboard-panel-title">Recent Orders</span>
              <Link to="/admin/orders" className="dashboard-card-link">View List →</Link>
            </div>
            <table className="dashboard-table">
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.transactionId} className="dashboard-table-row">
                    <td className="dashboard-table-cell dashboard-order-name">{order.productId}</td>
                    <td className="dashboard-table-cell dashboard-order-customer">{order.email}</td>
                    <td className="dashboard-table-cell">
                      <span className={`dashboard-status dashboard-status-${order.orderStatus}`}>
                        {statusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td className="dashboard-table-cell dashboard-order-amount">×{order.orderQuantity}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan="4" className="dashboard-table-cell" style={{ color: '#4a7a3a', textAlign: 'center', padding: '24px' }}>No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <span className="dashboard-panel-title">Weekly Sales</span>
              <Link to="/admin/sales" className="dashboard-card-link">View Report →</Link>
            </div>
            {salesRows.length === 0 ? (
              <p className="dashboard-chart-empty">No sales data this week.</p>
            ) : (
              <div className="dashboard-chart-area">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>

        </div>

        {/* SALES REPORT TABLE */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <span className="dashboard-panel-title">Sales Report (Weekly)</span>
            <Link to="/admin/sales" className="dashboard-card-link">View Full Report →</Link>
          </div>
          <table className="dashboard-table dashboard-full-table">
            <thead>
              <tr className="dashboard-table-head-row">
                <th className="dashboard-table-head">Product</th>
                <th className="dashboard-table-head">Quantity Sold</th>
                <th className="dashboard-table-head">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesRows.map((row, idx) => (
                <tr key={idx} className="dashboard-table-row">
                  <td className="dashboard-table-cell">{row._id}</td>
                  <td className="dashboard-table-cell">{row.totalQuantity}</td>
                  <td className="dashboard-table-cell">₱{row.totalRevenue?.toFixed(2)}</td>
                </tr>
              ))}
              {salesRows.length === 0 && (
                <tr><td colSpan="3" className="dashboard-table-cell" style={{ textAlign: 'center', padding: '24px', color: '#4a7a3a' }}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="dashboard-footer">
        <span className="dashboard-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="dashboard-footer-links">
          <Link to="/privacy" className="dashboard-footer-link">Privacy</Link>
          <Link to="/terms" className="dashboard-footer-link">Terms</Link>
          <Link to="/contact" className="dashboard-footer-link">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default Dashboard