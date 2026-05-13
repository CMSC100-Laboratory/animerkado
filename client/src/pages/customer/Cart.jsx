import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/Cart.css'

function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  // get /api/cart, fetch cart items for current user
  const fetchCart = () => {
    fetch(`/api/cart?email=${email}`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  // check login & fetch cart
  useEffect(() => {
    if (!email) { navigate('/login'); return }
    fetchCart()
  }, [email, navigate])

  // delete /api/cart/:id (remove item from cart)
  const handleRemove = async (itemId) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
    fetchCart()
  }

  // post /api/orders (place orders for all cart items)
  // delete /api/cart/:id (clear cart after checkout)
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

  // calculate subtotal
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="cart-wrapper">

      {/* navigation bar */}
      <nav className="cart-nav">
        <Link to="/" className="cart-nav-logo">
          <img src={logo} alt="Logo" className="cart-nav-logo-img" />
        </Link>
        <div className="cart-nav-right">
          <Link to="/shop" className="cart-nav-link">Shop</Link>
          <Link to="/cart" className="cart-nav-link active">Cart</Link>
          <button className="cart-nav-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            Logout ✕
          </button>
        </div>
      </nav>

      {/* main content */}
      <main className="cart-main">

        {loading ? (
          <div className="cart-empty">Loading...</div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            Your cart is empty. <Link to="/shop">Browse products</Link>
          </div>
        ) : (
          <>
            <h1 className="cart-title">My Cart <span className="cart-count">({items.length} items)</span></h1>

            <div className="cart-layout">

              {/* items */}
              <div className="cart-items-section">
                <div className="cart-items-header">
                  <span>Item and Price</span>
                  <span>Quantity</span>
                  <span>Total Price</span>
                  <span></span>
                </div>

                {items.map(item => (
                  <div className="cart-row" key={item._id}>
                    <div className="cart-row-info">
                      <div className="cart-row-img">[]</div>
                      <div>
                        <p className="cart-row-name">{item.productName}</p>
                        <p className="cart-row-price">₱{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="cart-row-qty">
                      <span>{item.quantity}</span>
                    </div>
                    <div className="cart-row-total">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="cart-row-actions">
                      <button className="cart-row-remove" onClick={() => handleRemove(item._id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* order summary */}
              <div className="cart-summary">
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
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-summary-footer">
                  <button className="cart-cancel-btn" onClick={() => navigate('/shop')}>Cancel</button>
                  <button className="cart-checkout-btn" onClick={handleCheckout}>Place Order</button>
                </div>
              </div>

            </div>
          </>
        )}
      </main>

      {/* footer */}
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