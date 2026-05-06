import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/ProductDetail.css'

function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        const found = data.find(p => p.productId === productId)
        setProduct(found || null)
        setRelated(data.filter(p => p.productId !== productId).slice(0, 6))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  const handleAddToCart = async () => {
    if (!email) { navigate('/login'); return }
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        productId: product.productId,
        productName: product.productName,
        quantity,
        price: product.price,
      })
    })
    const data = await res.json()
    if (data.inserted) {
      setMessage('Added to cart!')
      setTimeout(() => setMessage(''), 2500)
    }
  }

  const handleBuyNow = async () => {
    if (!email) { navigate('/login'); return }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.productId,
        orderQuantity: quantity,
        email,
      })
    })
    const data = await res.json()
    if (data.inserted) navigate('/order-confirmation')
  }

  if (loading) return <div className="pd-loading">Loading...</div>
  if (!product) return <div className="pd-loading">Product not found.</div>

  return (
    <div className="pd-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="pd-nav">
        <Link to="/" className="pd-nav-logo">
          <img src={logo} alt="Logo" className="pd-nav-logo-img" />
        </Link>
        <div className="pd-nav-right">
          <Link to="/shop" className="pd-nav-link">Shop</Link>
          <Link to="/cart" className="pd-nav-link">Cart</Link>
          <button className="pd-nav-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            Logout ✕
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pd-main">

        <p className="pd-breadcrumb">
          <Link to="/shop">Shop</Link> / {product.productName}
        </p>

        {/* PRODUCT PANEL */}
        <div className="pd-panel">

          {/* LEFT: image */}
          <div className="pd-panel-left">
            <div className="pd-image-placeholder">[]</div>
          </div>

          {/* RIGHT: info */}
          <div className="pd-panel-right">
            <p className="pd-type-label">{product.productType === 1 ? 'Crop' : 'Poultry'}</p>
            <h2 className="pd-name">{product.productName}</h2>
            <p className="pd-price">₱{product.price.toFixed(2)}</p>
            <p className="pd-desc">{product.productDescription || 'No description available.'}</p>

            <div className="pd-meta-row">
              <span className="pd-meta-item">
                Stock: {product.productQuantity > 0 ? `${product.productQuantity} available` : 'Out of stock'}
              </span>
            </div>

            {/* QUANTITY */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Qty</span>
              <div className="pd-qty-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.productQuantity, q + 1))}>+</button>
              </div>
              <span className="pd-total">Total: <strong>₱{(product.price * quantity).toFixed(2)}</strong></span>
            </div>

            {message && <span className="pd-success">{message}</span>}

            {/* ACTIONS */}
            <div className="pd-actions">
              <button
                className="pd-btn-cart"
                disabled={product.productQuantity === 0}
                onClick={handleAddToCart}
              >Add to Cart</button>
              <button
                className="pd-btn-buy"
                disabled={product.productQuantity === 0}
                onClick={handleBuyNow}
              >Buy Now</button>
            </div>
          </div>
        </div>

        {/* YOU MIGHT ALSO LIKE */}
        {related.length > 0 && (
          <div className="pd-related">
            <p className="pd-related-title">You might also like</p>
            <div className="pd-related-grid">
              {related.map(p => (
                <Link to={`/product/${p.productId}`} className="pd-related-card" key={p.productId}>
                  <div className="pd-related-img">[]</div>
                  <p className="pd-related-name">{p.productName}</p>
                  <p className="pd-related-price">₱{p.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="pd-footer">
        <span className="pd-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="pd-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>

    </div>
  )
}

export default ProductDetail