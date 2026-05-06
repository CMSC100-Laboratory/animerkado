import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/Cart.css'

function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  const fetchCart = () => {
    fetch(`/api/cart?email=${email}`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    if (!email) { navigate('/login'); return }
    fetchCart()
  }, [])

  const handleRemove = async (itemId) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
    fetchCart()
  }

  const handleCheckout = async () => {
    // POST one order per cart item
    await Promise.all(
      items.map(item =>
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            orderQuantity: item.quantity,
            email,
          })
        })
      )
    )
    // Clear cart after ordering
    await Promise.all(items.map(item => fetch(`/api/cart/${item._id}`, { method: 'DELETE' })))
    navigate('/order-confirmation')
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="cart-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="cart-nav">
        <Link to="/" className="cart-nav-logo">
          <img src={logo} alt="Logo" className="cart-nav-logo-img" />
        </Link>
        <div className="cart-nav-right">
          <Link to="/shop">← Continue Shopping</Link>
          <Link to="/orders">My Orders</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="cart-main">
        <h1 className="cart-title">YOUR CART</h1>

        {loading ? (
          <div className="cart-empty">Loading...</div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            Your cart is empty. <Link to="/shop">Browse products</Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ITEMS */}
            <div className="cart-items">
              {items.map(item => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.productName}</h3>
                    <p className="cart-item-meta">
                      Qty: {item.quantity} × ₱{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="cart-item-right">
                    <span className="cart-item-subtotal">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="cart-item-remove"
                      onClick={() => handleRemove(item._id)}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>
              <div className="cart-summary-row">
                <span>Items ({items.length})</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="cart-summary-divider" />
              <div className="cart-summary-total">
                <span>Total</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout}>
                Place Order
              </button>
              <p className="cart-note">
                Orders are subject to confirmation by our team.
              </p>
            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="cart-footer">
        <span className="cart-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="cart-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>

    </div>
  )
}

export default Cart