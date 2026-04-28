import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import loginBg from '../assets/login_bg.jpeg'
import registerBg from '../assets/register_bg.jpeg'
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // handle form submission
  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
  }

  return (
    <div className="login-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="login-nav">
        {/* logo on the left */}
        <Link to="/" className="login-nav-logo">
          <img src={logo} alt="Logo" className="login-nav-logo-img" />
        </Link>

        {/* right side */}
        <div className="login-nav-right">
          <span className="login-nav-text">New Here?</span>
          <Link to="/register" className="login-nav-btn">Register</Link>
        </div>
      </nav>

      {/* BODY */}
      <main className="login-main">

        {/* LOGIN CARD */}
        <div
          className="login-card"
          style={{ '--card-bg-img': `url(${loginBg})` }}
        >

          <h2 className="login-card-title">Welcome Back!</h2>
          <p className="login-card-subtitle">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.<br />
            Dolor sit amet consectetur adipiscing elit quisque.
          </p>

          {/* login form*/}
          <div className="login-form">
            {/* email field */}
            <label className="login-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="juandelacruz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* password field */}
            <label className="login-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="login-input"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* log in button */}
            <button className="login-submit-btn" onClick={handleLogin}>
              Log In
            </button>

            {/* register redirect link */}
            <p className="login-register-link">
              No account yet?{' '}
              <Link to="/register" className="login-register-anchor">Register now.</Link>
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
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