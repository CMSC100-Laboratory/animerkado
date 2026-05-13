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
  }, [email, navigate])

  const handleRemove = async (itemId) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
    fetchCart()
  }

  // Update quantity via PATCH; remove item if qty reaches 0
  const handleQtyChange = async (item, delta) => {
    const newQty = item.quantity + delta
    if (newQty <= 0) {
      await handleRemove(item._id)
      return
    }
    await fetch(`/api/cart/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    })
    fetchCart()
  }

  const handleCheckout = async () => {
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
    await fetch(`/api/cart?email=${email}`, { method: 'DELETE' })
    navigate('/order-confirmation')
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="cart-wrapper">

      {/* Navbar */}
      <nav className="cart-nav">
        <Link to="/" className="cart-nav-logo">
          <img src={logo} alt="AniMerkado Logo" className="cart-nav-logo-img" />
        </Link>
        <div className="cart-nav-right">
          <Link to="/shop" className="cart-nav-link">Shop</Link>
          <Link to="/cart" className="cart-nav-link active">Cart</Link>
          <Link to="/orders" className="cart-nav-link">History</Link>
          <button
            className="cart-nav-logout"
            onClick={() => { localStorage.clear(); navigate('/login') }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="cart-main">

        {loading ? (
          <div className="cart-empty">Loading your cart...</div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            Your cart is empty. <Link to="/shop">Browse products</Link>
          </div>
        ) : (
          <>
            <h1 className="cart-title">
              My Cart <span className="cart-count">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </h1>

            <div className="cart-layout">

              {/* Items list */}
              <div className="cart-items-section">
                <div className="cart-items-header">
                  <span>Item &amp; Price</span>
                  <span>Quantity</span>
                  <span>Total Price</span>
                  <span></span>
                </div>

                {items.map(item => (
                  <div className="cart-row" key={item._id}>

                    {/* Product info */}
                    <div className="cart-row-info">
                      <div className="cart-row-img">
                        <img
                          src={`http://localhost:5000${item.productImage}`}
                          alt={item.productName}
                          className="cart-product-image"
                        />
                      </div>
                      <div>
                        <p className="cart-row-name">{item.productName}</p>
                        <p className="cart-row-price">₱{item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Qty stepper */}
                    <div className="cart-row-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleQtyChange(item, -1)}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleQtyChange(item, +1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>

                    {/* Row total */}
                    <div className="cart-row-total">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <div className="cart-row-actions">
                      <button
                        className="cart-row-remove"
                        onClick={() => handleRemove(item._id)}
                        aria-label="Remove item"
                      >✕</button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="cart-summary">
                <p className="cart-summary-heading">Order Summary</p>

                <div className="cart-summary-body">
                  <div className="cart-summary-line">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-line">
                    <span>Cash on Delivery</span>
                    <span>₱0.00</span>
                  </div>
                  <div className="cart-summary-divider" />
                  <div className="cart-summary-total">
                    <span className="cart-summary-total-label">Total</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-summary-footer">
                  <button className="cart-cancel-btn" onClick={() => navigate('/shop')}>
                    Cancel
                  </button>
                  <button className="cart-checkout-btn" onClick={handleCheckout}>
                    Place Order
                  </button>
                </div>
              </div>

            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="cart-footer">
        <span className="cart-footer-copy">
          © 2026 AniMerkado – Department of Agriculture
        </span>
        <div className="cart-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default Cart