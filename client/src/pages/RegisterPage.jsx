import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import registerBg from '../assets/register_bg.jpeg'
import './RegisterPage.css'

function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError('')

    // frontend validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, middleName, lastName, email, password })
      })
      const data = await res.json()

      if (data.inserted) {
        navigate('/login')
      } else {
        setError(data.error || 'Registration failed. Email may already be in use.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="register-wrapper">
      <nav className="register-nav">
        <Link to="/" className="register-nav-logo">
          <img src={logo} alt="Logo" className="register-nav-logo-img" />
        </Link>
        <div className="register-nav-right">
          <span className="register-nav-text">Already have an Account?</span>
          <Link to="/login" className="register-nav-btn">Login</Link>
        </div>
      </nav>

      <main className="register-main">
        <div className="register-card" style={{ '--card-bg-img': `url(${registerBg})` }}>
          <h2 className="register-card-title">Create your Account</h2>
          <p className="register-card-subtitle">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.<br />
            Dolor sit amet consectetur adipiscing elit quisque.
          </p>

          <div className="register-form">
            <div className="register-row">
              <div className="register-field">
                <label className="register-label" htmlFor="reg-first-name">First Name</label>
                <input
                  id="reg-first-name"
                  type="text"
                  className="register-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="register-field">
                <label className="register-label" htmlFor="reg-last-name">Last Name</label>
                <input
                  id="reg-last-name"
                  type="text"
                  className="register-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <label className="register-label" htmlFor="reg-middle-name">
              Middle Name <span className="register-optional">(optional)</span>
            </label>
            <input
              id="reg-middle-name"
              type="text"
              className="register-input"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />

            <label className="register-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="register-input"
              placeholder="juandelacruz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="register-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="register-input"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="register-label" htmlFor="reg-confirm-password">Confirm Password</label>
            <input
              id="reg-confirm-password"
              type="password"
              className="register-input"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* error message */}
            {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

            <button className="register-submit-btn" onClick={handleRegister}>
              Create Account
            </button>

            <p className="register-terms">
              By creating your account, you agree to our{' '}
              <Link to="/terms" className="register-terms-link">Terms of Service.</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="register-footer">
        <span className="register-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="register-footer-links">
          <Link to="/privacy" className="register-footer-link">Privacy</Link>
          <Link to="/terms" className="register-footer-link">Terms</Link>
          <Link to="/contact" className="register-footer-link">Contact</Link>
        </div>
      </footer>
    </div>
  )
}

export default RegisterPage