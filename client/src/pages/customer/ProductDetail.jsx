import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/ProductDetail.css'

// NOTE: App.jsx route must be: <Route path="/product/:productId" ... />
// Currently it says /product/:id — change it to /product/:productId

function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
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
          <Link to="/shop">← Back to Shop</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pd-main">
        <h1 className="pd-heading">PRODUCT DETAIL</h1>

        <div className="pd-panel">

          {/* Left: image */}
          <div className="pd-panel-left">
            <div className="pd-image-placeholder">
              {product.productType === 1 ? '🌾' : '🐔'}
            </div>
          </div>

          {/* Right: info */}
          <div className="pd-panel-right">

            <div className="pd-panel-header">
              <span className="pd-panel-title">
                {product.productType === 1 ? 'CROP' : 'POULTRY'}
              </span>
            </div>

            <h2 className="pd-name">{product.productName}</h2>
            <p className="pd-desc">{product.productDescription || 'No description available.'}</p>

            {/* META */}
            <div className="pd-meta">
              <div className="pd-meta-item">
                <span className="pd-meta-label">Price</span>
                <span className="pd-price">₱{product.price.toFixed(2)}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Stock</span>
                <span>{product.productQuantity > 0 ? `${product.productQuantity} available` : 'Out of stock'}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Type</span>
                <span>{product.productType === 1 ? 'Crop' : 'Poultry'}</span>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="pd-qty-row">
              <span className="pd-meta-label">Quantity</span>
              <div className="pd-qty-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.productQuantity, q + 1))}>+</button>
              </div>
            </div>

            <div className="pd-total">
              Total: <strong>₱{(product.price * quantity).toFixed(2)}</strong>
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