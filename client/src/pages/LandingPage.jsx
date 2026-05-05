import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import landingBg from '../assets/landing_page_bg.jpeg'
import './styles/LandingPage.css'
 
// Placeholder: Fork Icon
function ForkIcon() {
  return (
    <svg className="objective-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2v6a3 3 0 0 0 3 3v11M6 2a1 1 0 0 0 0 8M18 2v6a3 3 0 0 1-3 3v11M18 2a1 1 0 0 1 0 8" />
    </svg>
  )
}
 
function LandingPage() {
  return (
    <div className="landing-wrapper">
 
      {/* NAVIGATION BAR */}
      <nav className="landing-nav">
        {/* Logo on the left */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Logo" className="nav-logo-img" />
        </Link>
 
        {/* Navigation tabs on the right */}
        <div className="nav-right">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/login" className="nav-btn nav-btn-login">Login</Link>
          <Link to="/register" className="nav-btn nav-btn-register">Register</Link>
        </div>
      </nav>
 
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${landingBg})` }}
      ></section>

      {/* OBJECTIVES & MISSION */}
      <section className="objectives-section">
        {/* Objectives */}
        <div className="objectives-group">
          {['Objective 1', 'Objective 2', 'Objective 3'].map((label) => (
            <div className="objective-card" key={label}>
              <ForkIcon />
              <h3>{label}</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor
                sit amet consectetur adipiscing elit quisque faucibus.
              </p>
            </div>
          ))}
        </div>
 
        {/* Mission */}
        <div className="mission-card">
          <h3>Our Mission</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit
            amet consectetur adipiscing elit quisque faucibus.
          </p>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer className="landing-footer">
        <span className="footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/terms" className="footer-link">Terms</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </footer>
 
    </div>
  )
}
 
export default LandingPage