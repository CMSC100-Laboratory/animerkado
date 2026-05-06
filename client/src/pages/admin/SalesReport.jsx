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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

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
      const res = await fetch(`/api/orders/sales?filter=${filter}`, {
        headers: authHeaders()
      })
      const data = await res.json()
      setter({
        report: data.report || [],
        totalSales: data.totalSales || 0,
        loading: false,
        error: ''
      })
    } catch (err) {
      setter(prev => ({ ...prev, loading: false, error: 'Failed to fetch sales data.' }))
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  }

  const buildBarData = (report) => ({
    labels: report.map(item => item._id),
    datasets: [
      {
        label: 'Revenue (₱)',
        data: report.map(item => item.totalRevenue),
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: '#000',
        borderWidth: 1
      }
    ]
  })

  const buildLineData = (report) => ({
    labels: report.map(item => item._id),
    datasets: [
      {
        label: 'Quantity Sold',
        data: report.map(item => item.totalQuantity),
        fill: false,
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        tension: 0.3
      }
    ]
  })

  const SalesPanel = ({ title, state }) => (
    <div className="sales-panel">

      {/* PANEL HEADER */}
      <div className="sales-panel-header">
        <span className="sales-panel-title">{title}</span>
        <span className="sales-panel-total">
          TOTAL: ₱{state.totalSales.toLocaleString()}
        </span>
      </div>

      {/* STATUS */}
      {state.loading && <p className="sales-status">Loading...</p>}
      {state.error && <p className="sales-status sales-error">{state.error}</p>}
      {!state.loading && !state.error && state.report.length === 0 && (
        <p className="sales-status">No sales data for this period.</p>
      )}

      {/* CHARTS AND TABLE */}
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

      {/* NAVIGATION BAR */}
      <nav className="sales-nav">
        <Link to="/admin/dashboard" className="sales-nav-logo">
          <img src={logo} alt="Logo" className="sales-nav-logo-img" />
        </Link>
        <button className="sales-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="sales-main">
        <h1 className="sales-heading">SALES REPORT</h1>

        {/* WEEKLY AND MONTHLY ROW */}
        <div className="sales-top-row">
          <SalesPanel title="WEEKLY SALES" state={weekly} />
          <SalesPanel title="MONTHLY SALES" state={monthly} />
        </div>

        {/* ANNUAL FULL WIDTH */}
        <SalesPanel title="ANNUAL SALES" state={annual} />

      </main>

      {/* FOOTER */}
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