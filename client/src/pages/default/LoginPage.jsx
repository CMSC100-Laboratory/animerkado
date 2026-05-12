import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import signinBg from '../../assets/signin_signup_bg.png'
import animerkadoText from '../../assets/animerkado_text.png'
import '../../styles/default/LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // handle login form submission
  const handleLogin = async () => {
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.token) {
        localStorage.setItem('email', data.email)
        localStorage.setItem('userType', data.userType)
        localStorage.setItem('token', data.token)

        if (data.userType === 'admin') {
          navigate('/admin/products')
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

      {/* navigation bar */}
      <nav className="login-nav">
        <Link to="/" className="login-nav-logo">
          <img src={logo} alt="AniMerkado Logo" className="login-nav-logo-img" />
          <span className="login-nav-logo-text">AniMerkado</span>
        </Link>

        <div className="login-nav-right">
          <Link to="/about" className="login-nav-link">About</Link>
          <Link to="/shop" className="login-nav-link">Shop</Link>
          <Link to="/login" className="login-nav-btn login-nav-btn-login">Login</Link>
          <Link to="/register" className="login-nav-btn login-nav-btn-register">Register</Link>
        </div>
      </nav>

      {/* main content */}
      <main className="login-main" style={{ backgroundImage: `url(${signinBg})` }}>

        {/* animerkado text — left half */}
        <div className="login-left">
          <img src={animerkadoText} alt="AniMerkado" className="login-left-text-img" />
            <p className="login-left-text"> Fresh products straight from local farms </p>
        </div>
        

        {/* right panel — transparent, login form */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-card-title">Welcome Back!</h2>
            <p className="login-card-subtitle">
              Fresh products straight from local farms.<br />
              Sign in to continue shopping.
            </p>

            <div className="login-form">
              {/* email */}
              <label className="login-label" htmlFor="login-email">EMAIL ADDRESS</label>
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="juandelacruz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* password */}
              <label className="login-label" htmlFor="login-password">PASSWORD</label>
              <input
                id="login-password"
                type="password"
                className="login-input"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* error message */}
              {error && <p className="login-error">{error}</p>}

              <button className="login-submit-btn" onClick={handleLogin}>
                Log In
              </button>

              <p className="login-register-link">
                No account yet?{' '}
                <Link to="/register" className="login-register-anchor">Register now.</Link>
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* footer */}
      <footer className="login-footer">
        <span className="login-footer-copy">© 2026 AniMerkado – Department of Agriculture</span>
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