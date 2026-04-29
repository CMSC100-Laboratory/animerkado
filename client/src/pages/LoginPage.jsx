import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import loginBg from '../assets/login_bg.jpeg'
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.loggedIn) {
        localStorage.setItem('email', data.email)
        localStorage.setItem('userType', data.userType)
        localStorage.setItem('token', data.token)

        if (data.userType === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/shop')
        }
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="login-wrapper">
      <nav className="login-nav">
        <Link to="/" className="login-nav-logo">
          <img src={logo} alt="Logo" className="login-nav-logo-img" />
        </Link>
        <div className="login-nav-right">
          <span className="login-nav-text">New Here?</span>
          <Link to="/register" className="login-nav-btn">Register</Link>
        </div>
      </nav>

      <main className="login-main">
        <div className="login-card" style={{ '--card-bg-img': `url(${loginBg})` }}>
          <h2 className="login-card-title">Welcome Back!</h2>
          <p className="login-card-subtitle">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.<br />
            Dolor sit amet consectetur adipiscing elit quisque.
          </p>

          <div className="login-form">
            <label className="login-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="juandelacruz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="login-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="login-input"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* error message */}
            {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

            <button className="login-submit-btn" onClick={handleLogin}>
              Log In
            </button>

            <p className="login-register-link">
              No account yet?{' '}
              <Link to="/register" className="login-register-anchor">Register now.</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <span className="login-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="login-footer-links">
          <Link to="/privacy" className="login-footer-link">Privacy</Link>
          <Link to="/terms" className="login-footer-link">Terms</Link>
          <Link to="/contact" className="login-footer-link">Contact</Link>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage