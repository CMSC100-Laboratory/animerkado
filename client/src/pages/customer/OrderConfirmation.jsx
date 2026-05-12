import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/OrderConfirmation.css'

function OrderConfirmation() {
  const navigate = useNavigate()

  // Simple ref number — replace with real order ID passed via router state if available
  const ref = `ORD-${Date.now().toString(36).toUpperCase()}`

  return (
    <div className="oc-wrapper">

      {/* Navbar */}
      <nav className="oc-nav">
        <Link to="/" className="oc-nav-logo">
          <img src={logo} alt="AniMerkado Logo" className="oc-nav-logo-img" />
        </Link>
        <div className="oc-nav-right">
          <Link to="/shop" className="oc-nav-link">Shop</Link>
          <Link to="/orders" className="oc-nav-link">History</Link>
          <button
            className="oc-nav-logout"
            onClick={() => { localStorage.clear(); navigate('/login') }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Confirmation card */}
      <main className="oc-main">
        <div className="oc-card">

          {/* Animated tick */}
          <div className="oc-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="oc-heading">Order Placed!</h1>

          <p className="oc-sub">
            Thank you for your purchase. Your order has been received and is
            being processed. You'll receive updates on your order status shortly.
          </p>

          <span className="oc-ref">Ref: {ref}</span>

          <div className="oc-divider" />

          <div className="oc-actions">
            <Link to="/orders" className="oc-btn-orders">View Orders</Link>
            <Link to="/shop" className="oc-btn-shop">Continue Shopping</Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="oc-footer">
        <span className="oc-footer-copy">
          © 2026 AniMerkado – Department of Agriculture
        </span>
        <div className="oc-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default OrderConfirmation