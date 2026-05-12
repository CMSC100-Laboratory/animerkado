import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import signinBg from '../../assets/signin_signup_bg.png'
import animerkadoText from '../../assets/animerkado_text.png'
import '../../styles/customer/RegisterPage.css'

function RegisterPage() {
  const [firstName, setFirstName]   = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName]     = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [error, setError]           = useState('')
  const navigate = useNavigate()

  // handle register form submission
  const handleRegister = async () => {
    setError('')

    if (password !== confirm) {
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
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="register-wrapper">

      {/* navigation bar */}
      <nav className="register-nav">
        <Link to="/" className="register-nav-logo">
          <img src={logo} alt="AniMerkado Logo" className="register-nav-logo-img" />
          <span className="register-nav-logo-text">AniMerkado</span>
        </Link>

        <div className="register-nav-right">
          <Link to="/about" className="register-nav-link">About</Link>
          <Link to="/shop" className="register-nav-link">Shop</Link>
          <Link to="/login" className="register-nav-btn register-nav-btn-login">Login</Link>
          <Link to="/register" className="register-nav-btn register-nav-btn-register">Register</Link>
        </div>
      </nav>

      {/* main */}
      <main className="register-main" style={{ backgroundImage: `url(${signinBg})` }}>

        {/* animerkado text — left half */}
        <div className="register-left">
          <img src={animerkadoText} alt="AniMerkado" className="register-left-text-img" />
          <p className="register-left-text"> Fresh products straight from local farms </p>
        </div>

        {/* right panel — transparent, register form */}
        <div className="register-right">
          <div className="register-card">
            <h2 className="register-card-title">Create Account</h2>
            <p className="register-card-subtitle">
              Join AniMerkado and support local farmers.<br />
              Fresh products, straight from the source.
            </p>

            <div className="register-form">

              {/* name row */}
              <div className="register-row">
                <div className="register-field">
                  <label className="register-label" htmlFor="register-firstname">FIRST NAME</label>
                  <input
                    id="register-firstname"
                    type="text"
                    className="register-input"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="register-field">
                  <label className="register-label" htmlFor="register-lastname">LAST NAME</label>
                  <input
                    id="register-lastname"
                    type="text"
                    className="register-input"
                    placeholder="Dela Cruz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* middle name */}
              <div className="register-field">
                <label className="register-label" htmlFor="register-middlename">
                  MIDDLE NAME <span className="register-optional">(optional)</span>
                </label>
                <input
                  id="register-middlename"
                  type="text"
                  className="register-input"
                  placeholder="Santos"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>

              {/* email */}
              <div className="register-field">
                <label className="register-label" htmlFor="register-email">EMAIL ADDRESS</label>
                <input
                  id="register-email"
                  type="email"
                  className="register-input"
                  placeholder="juandelacruz@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password row */}
              <div className="register-row">
                <div className="register-field">
                  <label className="register-label" htmlFor="register-password">PASSWORD</label>
                  <input
                    id="register-password"
                    type="password"
                    className="register-input"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="register-field">
                  <label className="register-label" htmlFor="register-confirm">CONFIRM PASSWORD</label>
                  <input
                    id="register-confirm"
                    type="password"
                    className="register-input"
                    placeholder="••••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
              </div>

              {/* error message */}
              {error && <p className="register-error">{error}</p>}

              <button className="register-submit-btn" onClick={handleRegister}>
                Create Account
              </button>

              <p className="register-terms">
                By registering, you agree to our{' '}
                <Link to="/terms" className="register-terms-link">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" className="register-terms-link">Privacy Policy</Link>.
              </p>

              <p className="register-login-link">
                Already have an account?{' '}
                <Link to="/login" className="register-login-anchor">Log in here.</Link>
              </p>

            </div>
          </div>
        </div>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="register-footer">
        <span className="register-footer-copy">© 2026 AniMerkado – Department of Agriculture</span>
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