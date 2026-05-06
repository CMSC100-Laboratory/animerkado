import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/admin/UserManagement.css'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (search) {
      setFiltered(users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      ))
    } else {
      setFiltered(users)
    }
  }, [users, search])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setUsers(data.users || data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="users-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="users-nav">
        <Link to="/admin/dashboard" className="users-nav-logo">
          <img src={logo} alt="Logo" className="users-nav-logo-img" />
        </Link>
        <button className="users-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="users-main">
        <h1 className="users-heading">REGISTERED USERS</h1>

        {/* SEARCH */}
        <input
          type="text"
          className="users-search-input"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* TABLE PANEL */}
        <div className="users-panel">
          <div className="users-panel-header">
            <span className="users-panel-title">ALL USERS ({filtered.length})</span>
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
                  <td className="users-table-cell">{user.name}</td>
                  <td className="users-table-cell">{user.email}</td>
                  <td className="users-table-cell">{user.orderCount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* FOOTER */}
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