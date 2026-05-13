import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import logo from '../../assets/logo.png'
import { authHeaders } from '../../utils/auth.js'
import '../../styles/admin/SalesReport.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

function SalesReport() {
  const [weekly, setWeekly] = useState({ report: [], totalSales: 0, loading: false, error: '' })
  const [monthly, setMonthly] = useState({ report: [], totalSales: 0, loading: false, error: '' })
  const [annual, setAnnual] = useState({ report: [], totalSales: 0, loading: false, error: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchSales('weekly', setWeekly)
    fetchSales('monthly', setMonthly)
    fetchSales('annual', setAnnual)
  }, [])

  const fetchSales = async (filter, setter) => {
    setter(prev => ({ ...prev, loading: true, error: '' }))
    try {
      const res = await fetch(`/api/orders/sales?filter=${filter}`, { headers: authHeaders() })
      const data = await res.json()
      setter({ report: data.report || [], totalSales: data.totalSales || 0, loading: false, error: '' })
    } catch {
      setter(prev => ({ ...prev, loading: false, error: 'Failed to fetch sales data.' }))
    }
  }

  const handleLogout = () => { localStorage.clear(); navigate('/login') }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(106,158,73,0.1)' } },
      x: { grid: { display: false } }
    }
  }

  const buildBarData = (report) => ({
    labels: report.map(item => item._id),
    datasets: [{
      label: 'Revenue (₱)',
      data: report.map(item => item.totalRevenue),
      backgroundColor: 'rgba(7, 102, 83, 0.55)',
      borderColor: '#076653',
      borderWidth: 1,
      borderRadius: 5,
    }]
  })

  const buildLineData = (report) => ({
    labels: report.map(item => item._id),
    datasets: [{
      label: 'Qty Sold',
      data: report.map(item => item.totalQuantity),
      fill: false,
      borderColor: '#6A9E49',
      backgroundColor: 'rgba(106,158,73,0.2)',
      tension: 0.3,
      pointBackgroundColor: '#6A9E49',
    }]
  })

  const SalesPanel = ({ title, state }) => (
    <div className="sales-panel">
      <div className="sales-panel-header">
        <span className="sales-panel-title">{title}</span>
        <span className="sales-panel-total">Total: ₱{state.totalSales.toLocaleString()}</span>
      </div>

      {state.loading && <p className="sales-status">Loading...</p>}
      {state.error && <p className="sales-status sales-error">{state.error}</p>}
      {!state.loading && !state.error && state.report.length === 0 && (
        <p className="sales-status">No sales data for this period.</p>
      )}

      {!state.loading && state.report.length > 0 && (
        <>
          <div className="sales-charts-row">
            <div className="sales-chart">
              <h3 className="sales-chart-title">Revenue per Product</h3>
              <Bar data={buildBarData(state.report)} options={chartOptions} />
            </div>
            <div className="sales-chart">
              <h3 className="sales-chart-title">Quantity Sold per Product</h3>
              <Line data={buildLineData(state.report)} options={chartOptions} />
            </div>
          </div>
          <table className="sales-table">
            <thead>
              <tr className="sales-table-head-row">
                <th className="sales-table-head">Product Name</th>
                <th className="sales-table-head">Quantity Sold</th>
                <th className="sales-table-head">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {state.report.map((item, index) => (
                <tr key={index} className="sales-table-row">
                  <td className="sales-table-cell">{item._id}</td>
                  <td className="sales-table-cell">{item.totalQuantity}</td>
                  <td className="sales-table-cell">₱{item.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )

  return (
    <div className="sales-wrapper">

      {/* ── NAVIGATION BAR ── */}
      <nav className="sales-nav">
        <Link to="/admin/dashboard" className="sales-nav-logo">
          <img src={logo} alt="Logo" className="sales-nav-logo-img" />
        </Link>
        <div className="sales-nav-right">
          <Link to="/admin/dashboard" className="sales-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="sales-nav-link">Products</Link>
          <Link to="/admin/orders" className="sales-nav-link">Orders</Link>
          <Link to="/admin/users" className="sales-nav-link">Users</Link>
          <button className="sales-logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="sales-main">
        <h1 className="sales-heading">Sales Report</h1>

        <div className="sales-top-row">
          <SalesPanel title="Weekly Sales" state={weekly} />
          <SalesPanel title="Monthly Sales" state={monthly} />
        </div>

        <SalesPanel title="Annual Sales" state={annual} />
      </main>

      {/* ── FOOTER ── */}
      <footer className="sales-footer">
        <span className="sales-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="sales-footer-links">
          <Link to="/privacy" className="sales-footer-link">Privacy</Link>
          <Link to="/terms" className="sales-footer-link">Terms</Link>
          <Link to="/contact" className="sales-footer-link">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default SalesReport