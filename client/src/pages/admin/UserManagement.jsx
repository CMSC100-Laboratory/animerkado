import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/admin/UserManagement.css'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchUsers() }, [])

  useEffect(() => {
    if (search) {
      setFiltered(users.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
        return fullName.includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      }))
    } else {
      setFiltered(users)
    }
  }, [users, search])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setUsers(data.users || data)
    } catch (err) { console.error('Failed to fetch users:', err) }
  }

  const handleLogout = () => { localStorage.clear(); navigate('/login') }

  return (
    <div className="users-wrapper">

      {/* ── NAVIGATION BAR ── */}
      <nav className="users-nav">
        <Link to="/admin/dashboard" className="users-nav-logo">
          <img src={logo} alt="Logo" className="users-nav-logo-img" />
        </Link>
        <div className="users-nav-right">
          <Link to="/admin/dashboard" className="users-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="users-nav-link">Products</Link>
          <Link to="/admin/orders" className="users-nav-link">Orders</Link>
          <Link to="/admin/sales" className="users-nav-link">Sales</Link>
          <button className="users-logout-btn" onClick={handleLogout}>Log Out ✕</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="users-main">
        <h1 className="users-heading">Registered Users</h1>

        <input
          type="text"
          className="users-search-input"
          placeholder="Search users by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="users-panel">
          <div className="users-panel-header">
            <span className="users-panel-title">All Users ({filtered.length})</span>
          </div>

          <table className="users-table">
            <thead>
              <tr className="users-table-head-row">
                <th className="users-table-head">Name</th>
                <th className="users-table-head">Email</th>
                <th className="users-table-head">Orders</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} className="users-table-row">
                  <td className="users-table-cell" style={{ fontWeight: 600 }}>
                    {user.firstName} {user.middleName} {user.lastName}
                  </td>
                  <td className="users-table-cell" style={{ color: '#4a7a3a' }}>{user.email}</td>
                  <td className="users-table-cell">
                    <span className={`users-role-badge users-role-badge--${user.userType}`}>
                      {user.userType}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: '#4a7a3a', fontSize: '0.9rem' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="users-footer">
        <span className="users-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="users-footer-links">
          <Link to="/privacy" className="users-footer-link">Privacy</Link>
          <Link to="/terms" className="users-footer-link">Terms</Link>
          <Link to="/contact" className="users-footer-link">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default UserManagement