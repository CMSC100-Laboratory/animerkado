import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import background from '../../assets/background.png'
import '../../styles/customer/Shop.css'

function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('name')
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
        productImage: product.productImage,
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
      if (sort === 'name-desc') return b.productName.localeCompare(a.productName)
      return a.productName.localeCompare(b.productName)
    })

  return (
    <div
      className="shop-wrapper"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >

      {/* Navbar */}
      <nav className="shop-nav">
        <Link to="/" className="shop-nav-logo">
          <img src={logo} alt="Logo" className="shop-nav-logo-img" />
        </Link>
        <div className="shop-nav-right">
          <Link to="/shop" className="shop-nav-link active">Shop</Link>
          <Link to="/cart" className="shop-nav-link">Cart</Link>
          <Link to="/orders" className="shop-nav-link">History</Link>
          <button
            className="shop-nav-logout"
            onClick={() => { localStorage.clear(); navigate('/login') }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="shop-main">

        <div className="shop-controls">
          <div className="shop-search-row">
            <input
              className="shop-search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="shop-type-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="1">Crops</option>
              <option value="2">Poultry</option>
            </select>
          </div>

          <div className="shop-sort-row">
            <span className="shop-sort-label">Sort:</span>
            {[
              ['name', 'Name A–Z'],
              ['name-desc', 'Name Z–A'],
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
            {[['all', 'All'], ['1', 'Crops'], ['2', 'Poultry']].map(([val, label]) => (
              <button
                key={val}
                className={`shop-filter-btn${filter === val ? ' active' : ''}`}
                onClick={() => setFilter(val)}
              >{label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="shop-empty">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="shop-empty">No products found.</div>
        ) : (
          <div className="shop-grid">
            {filtered.map(product => (
              <div className="shop-card" key={product.productId}>
                <div className="shop-card-img">
                  <img
                    src={`http://localhost:5000${product.productImage}`}
                    alt={product.productName}
                    className="pd-image"
                  />
                </div>
                <div className="shop-card-body">
                  <p className="shop-card-name">{product.productName}</p>
                  {product.productDescription && (
                    <p className="shop-card-desc">{product.productDescription}</p>
                  )}
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

      {/* Footer */}
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