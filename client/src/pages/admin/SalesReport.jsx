import { useState, useEffect } from 'react'
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
import { authHeaders } from '../../utils/auth.js'
import './styles/SalesReport.css'

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
  const [filter, setFilter] = useState('weekly')
  const [report, setReport] = useState([])
  const [totalSales, setTotalSales] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSales = async (selectedFilter) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/orders/sales?filter=${selectedFilter}`, {
        headers: authHeaders()
      })
      const data = await res.json()
      setReport(data.report || [])
      setTotalSales(data.totalSales || 0)
    } catch (err) {
      setError('Failed to fetch sales data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales(filter)
  }, [filter])

  const barData = {
    labels: report.map(item => item._id),
    datasets: [
      {
        label: 'Revenue (₱)',
        data: report.map(item => item.totalRevenue),
        backgroundColor: 'rgba(34, 139, 34, 0.6)',
        borderColor: 'rgba(34, 139, 34, 1)',
        borderWidth: 1
      }
    ]
  }

  const lineData = {
    labels: report.map(item => item._id),
    datasets: [
      {
        label: 'Quantity Sold',
        data: report.map(item => item.totalQuantity),
        fill: false,
        borderColor: 'rgba(255, 165, 0, 1)',
        backgroundColor: 'rgba(255, 165, 0, 0.4)',
        tension: 0.3
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  }

  return (
    <div className="sales-wrapper">
      <h2 className="sales-title">Sales Report</h2>

      {/* filter toggle */}
      <div className="sales-filters">
        {['weekly', 'monthly', 'annual'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`sales-filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* total sales */}
      <div className="sales-total">
        Total Sales: ₱{totalSales.toLocaleString()}
      </div>

      {loading && <p className="sales-status">Loading...</p>}
      {error && <p className="sales-status sales-error">{error}</p>}
      {!loading && report.length === 0 && (
        <p className="sales-status">No sales data for this period.</p>
      )}

      {!loading && report.length > 0 && (
        <>
          <div className="sales-chart">
            <h3>Revenue per Product</h3>
            <Bar data={barData} options={chartOptions} />
          </div>

          <div className="sales-chart">
            <h3>Quantity Sold per Product</h3>
            <Line data={lineData} options={chartOptions} />
          </div>

          <h3 className="sales-table-title">Summary</h3>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.totalQuantity}</td>
                  <td>₱{item.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default SalesReport