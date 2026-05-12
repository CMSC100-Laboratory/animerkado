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

  // GET /api/users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setUserCount(data.total || 0)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  // GET /api/products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      const crops = data.filter(p => p.productType === 1).length
      const poultry = data.filter(p => p.productType === 2).length
      setProductCounts({ total: data.length, crops, poultry })
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  // GET /api/orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      const pending = data.filter(o => o.orderStatus === 0).length
      setOrderCounts({ total: data.length, pending })
      const sorted = [...data].sort(
        (a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered)
      )
      setRecentOrders(sorted.slice(0, 5))
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  // GET /api/orders/sales?filter=weekly
  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/orders/sales?filter=weekly', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setSalesRows(data.report || [])
    } catch (err) {
      console.error('Failed to fetch sales:', err)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  // order status label
  const statusLabel = (status) => {
    if (status === 0) return 'PENDING'
    if (status === 1) return 'CONFIRMED'
    if (status === 2) return 'CANCELED'
    return 'UNKNOWN'
  }

  // weekly sales chart data
  const chartData = {
    labels: salesRows.map(r => r._id),
    datasets: [
      {
        label: 'Revenue (₱)',
        data: salesRows.map(r => r.totalRevenue),
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: '#000',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }

  return (
    <div className="dashboard-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="dashboard-nav">
        <Link to="/admin/dashboard" className="dashboard-nav-logo">
          <img src={logo} alt="Logo" className="dashboard-nav-logo-img" />
        </Link>
        <button className="dashboard-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <h1 className="dashboard-heading">ADMIN DASHBOARD</h1>
        <p className="dashboard-subheading">
          This dashboard provides an overview of the Farm to Table e-commerce platform,
          including product listings, customer orders, sales reports, and registered user accounts.
        </p>

        {/* SUMMARY CARDS */}
        <div className="dashboard-summary-row">

          {/* Registered Users */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-label">REGISTERED USERS</span>
              <Link to="/admin/users" className="dashboard-card-link">View List →</Link>
            </div>
            <div className="dashboard-card-count">{userCount}</div>
          </div>

          {/* Listed Products */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-label">LISTED PRODUCTS</span>
              <Link to="/admin/products" className="dashboard-card-link">View List →</Link>
            </div>
            <div className="dashboard-card-count">{productCounts.total}</div>
            <div className="dashboard-card-sub">
              {productCounts.crops} Crops &nbsp; {productCounts.poultry} Poultry
            </div>
          </div>

          {/* Orders */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-label">ORDERS</span>
              <Link to="/admin/orders" className="dashboard-card-link">View List →</Link>
            </div>
            <div className="dashboard-card-count">{orderCounts.total}</div>
            <div className="dashboard-card-sub">{orderCounts.pending} pending confirmation</div>
          </div>

        </div>

        {/* RECENT ORDERS AND WEEKLY SALES */}
        <div className="dashboard-mid-row">

          {/* Recent Orders */}
          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <span className="dashboard-panel-title">RECENT ORDERS</span>
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
                    <td className="dashboard-table-cell dashboard-order-amount">
                      x{order.orderQuantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weekly Sales Chart */}
          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <span className="dashboard-panel-title">WEEKLY SALES</span>
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
            <span className="dashboard-panel-title">SALES REPORT (WEEKLY)</span>
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
            </tbody>
          </table>
        </div>

      </main>

      {/* FOOTER */}
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