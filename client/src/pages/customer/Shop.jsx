import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/Shop.css'

function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleAddToCart = async (product) => {
    if (!email) { navigate('/login'); return }
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        productId: product.productId,
        productName: product.productName,
        quantity: 1,
        price: product.price,
      })
    })
    navigate('/cart')
  }

  const filtered = products.filter(p => {
    const matchType = filter === 'all' || String(p.productType) === filter
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="shop-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="shop-nav">
        <Link to="/" className="shop-nav-logo">
          <img src={logo} alt="Logo" className="shop-nav-logo-img" />
        </Link>
        <div className="shop-nav-right">
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
          <button className="shop-nav-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            Log Out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="shop-main">
        <h1 className="shop-heading">SHOP</h1>

        {/* SEARCH + FILTER */}
        <div className="shop-controls">
          <input
            className="shop-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="shop-filter-btns">
            {[['all', 'All'], ['1', 'Crops'], ['2', 'Poultry']].map(([val, label]) => (
              <button
                key={val}
                className={`shop-filter-btn${filter === val ? ' active' : ''}`}
                onClick={() => setFilter(val)}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="shop-loading">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="shop-empty">No products found.</div>
        ) : (
          <div className="shop-grid">
            {filtered.map(product => (
              <div className="shop-card" key={product.productId}>
                <div className="shop-card-badge">
                  {product.productType === 1 ? 'Crop' : 'Poultry'}
                </div>
                <div className="shop-card-body">
                  <h3 className="shop-card-name">{product.productName}</h3>
                  <p className="shop-card-desc">{product.productDescription || 'No description.'}</p>
                  <div className="shop-card-stock">
                    {product.productQuantity > 0
                      ? `${product.productQuantity} in stock`
                      : 'Out of stock'}
                  </div>
                </div>
                <div className="shop-card-footer">
                  <span className="shop-card-price">₱{product.price.toFixed(2)}</span>
                  <div className="shop-card-actions">
                    <Link to={`/product/${product.productId}`} className="shop-btn-view">View</Link>
                    <button
                      className="shop-btn-cart"
                      disabled={product.productQuantity === 0}
                      onClick={() => handleAddToCart(product)}
                    >Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="shop-footer">
        <span className="shop-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="shop-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default Shop