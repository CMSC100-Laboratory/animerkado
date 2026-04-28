import { useState } from 'react'
import { Link } from 'react-router-dom'
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

  // handle account creation
  const handleRegister = () => {
    console.log('Register attempt:', { firstName, lastName, middleName, email, password, confirmPassword })
  }

  return (
    <div className="register-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="register-nav">
        {/* logo on the left */}
        <Link to="/" className="register-nav-logo">
          <img src={logo} alt="Logo" className="register-nav-logo-img" />
        </Link>

        {/* right side */}
        <div className="register-nav-right">
          <span className="register-nav-text">Already have an Account?</span>
          <Link to="/login" className="register-nav-btn">Login</Link>
        </div>
      </nav>

      {/* BODY */}
      <main className="register-main">

        {/* REGISTRATION CARD */}
        <div
          className="register-card"
          style={{ '--card-bg-img': `url(${registerBg})` }}
        >
          {/* card header */}
          <h2 className="register-card-title">Create your Account</h2>
          <p className="register-card-subtitle">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.<br />
            Dolor sit amet consectetur adipiscing elit quisque.
          </p>

          {/* registration form fields */}
          <div className="register-form">

            {/* first name + last name */}
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

            {/* middle name (optional) */}
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

            {/* email address */}
            <label className="register-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="register-input"
              placeholder="juandelacruz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* password */}
            <label className="register-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="register-input"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* confirm password */}
            <label className="register-label" htmlFor="reg-confirm-password">Confirm Password</label>
            <input
              id="reg-confirm-password"
              type="password"
              className="register-input"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* create account button */}
            <button className="register-submit-btn" onClick={handleRegister}>
              Create Account
            </button>

            {/* terms of service */}
            <p className="register-terms">
              By creating your account, you agree to our{' '}
              <Link to="/terms" className="register-terms-link">Terms of Service.</Link>
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
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