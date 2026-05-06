import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/customer/Shop.css'

function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('')
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

  const filtered = products
    .filter(p => {
      const matchType = filter === 'all' || String(p.productType) === filter
      const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'qty') return b.productQuantity - a.productQuantity
      if (sort === 'name') return a.productName.localeCompare(b.productName)
      return 0
    })

  return (
    <div className="shop-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="shop-nav">
        <Link to="/" className="shop-nav-logo">
          <img src={logo} alt="Logo" className="shop-nav-logo-img" />
        </Link>
        <div className="shop-nav-right">
          <Link to="/shop" className="shop-nav-link active">Shop</Link>
          <Link to="/cart" className="shop-nav-link">Cart</Link>
          <button className="shop-nav-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            Logout ✕
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="shop-main">

        {/* SEARCH + SORT + FILTER */}
        <div className="shop-controls">
          <input
            className="shop-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="shop-sort-row">
            <span className="shop-sort-label">Sort by:</span>
            {[
              ['', 'Default'],
              ['name', 'Name'],
              ['price-asc', 'Price ↑'],
              ['price-desc', 'Price ↓'],
              ['qty', 'Quantity'],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`shop-sort-btn${sort === val ? ' active' : ''}`}
                onClick={() => setSort(val)}
              >{label}</button>
            ))}
          </div>
          <div className="shop-filter-row">
            {[['all', 'All'], ['1', 'Crop'], ['2', 'Poultry']].map(([val, label]) => (
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
          <div className="shop-empty">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="shop-empty">No products found.</div>
        ) : (
          <div className="shop-grid">
            {filtered.map(product => (
              <div className="shop-card" key={product.productId}>
                <div className="shop-card-img">
                  <span className="shop-card-img-icon">[]</span>
                </div>
                <div className="shop-card-body">
                  <p className="shop-card-name">{product.productName}</p>
                  <p className="shop-card-price">₱{product.price.toFixed(2)}</p>
                </div>
                <div className="shop-card-actions">
                  <Link to={`/product/${product.productId}`} className="shop-btn-view">View</Link>
                  <button
                    className="shop-btn-cart"
                    disabled={product.productQuantity === 0}
                    onClick={() => handleAddToCart(product)}
                  >Add to Cart</button>
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