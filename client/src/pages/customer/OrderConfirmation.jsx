// NOTE: OrderConfirmation has NO backend logic — it is a pure success screen.
// It is shown after Cart.jsx successfully POSTs orders and clears the cart.
// No fetch calls needed here.

import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/OrderConfirmation.css'

function OrderConfirmation() {
  return (
    <div className="oc-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="oc-nav">
        <Link to="/" className="oc-nav-logo">
          <img src={logo} alt="Logo" className="oc-nav-logo-img" />
        </Link>
      </nav>

      {/* MAIN */}
      <main className="oc-main">
        <div className="oc-card">
          <div className="oc-icon">/</div>
          <h1 className="oc-title">Order Placed!</h1>
          <p className="oc-subtitle">
            Your order has been submitted and is now <strong>pending confirmation</strong> by our team.
            You can track it in your order history.
          </p>
          <div className="oc-actions">
            <Link to="/orders" className="oc-btn-primary">View My Orders</Link>
            <Link to="/shop" className="oc-btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="oc-footer">
        <span className="oc-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
      </footer>

    </div>
  )
}

export default OrderConfirmation