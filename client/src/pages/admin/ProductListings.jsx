import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/admin/ProductListings.css'
import ProductForm from './Products'

const api_url = "http://localhost:5000/api/products"

function ProductListings() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sort, setSort] = useState('name-az')

  //  Form control
  const [selectedProduct, setSelectedProduct] = useState(null)

  const navigate = useNavigate()
  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, search, typeFilter, sort])

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(api_url, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  // ================= FILTER + SORT =================
  const applyFilters = () => {
    let result = [...products]

    if (typeFilter === 'crops') result = result.filter(p => p.productType === 1)
    if (typeFilter === 'poultry') result = result.filter(p => p.productType === 2)

    if (search) {
      result = result.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sort === 'name-az') result.sort((a, b) => a.productName?.localeCompare(b.productName))
    if (sort === 'name-za') result.sort((a, b) => b.productName?.localeCompare(a.productName))
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'quantity') result.sort((a, b) => b.productQuantity - a.productQuantity)

    setFiltered(result)
  }

  // ================= SUBMIT (ADD / UPDATE) =================
  const handleSubmit = async (form) => {
    try {
      if (form.productId) {
        // UPDATE
        await fetch(`${api_url}/${form.productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify(form)
        })
      } else {
        // ADD
        await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({
            ...form,
            productId: crypto.randomUUID()
          })
        })
      }

      setSelectedProduct(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    try {
      await fetch(`${api_url}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  // ================= UI HELPERS =================
  const typeLabel = (type) => {
    if (type === 1) return 'Crops'
    if (type === 2) return 'Poultry'
    return '—'
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const sortOptions = [
    { key: 'name-az', label: 'Name A-Z' },
    { key: 'name-za', label: 'Name Z-A' },
    { key: 'price-asc', label: 'Price ↑' },
    { key: 'price-desc', label: 'Price ↓' },
    { key: 'quantity', label: 'Quantity' },
  ]

  return (
    <div className="products-wrapper">

      {/* NAVIGATION BAR */}
      <nav className="products-nav">
        <Link to="/admin/dashboard" className="products-nav-logo">
          <img src={logo} alt="Logo" className="products-nav-logo-img" />
        </Link>
        <button className="products-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="products-main">
        <h1 className="products-heading">LISTED PRODUCTS</h1>

        {/* SEARCH AND TYPE FILTER */}
        <div className="products-search-row">
          <input
            type="text"
            className="products-search-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="products-type-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="crops">Crops</option>
            <option value="poultry">Poultry</option>
          </select>
        </div>

        {/* SORTING */}
        <div className="products-sort-row">
          <span className="products-sort-label">Sort:</span>
          {sortOptions.map(opt => (
            <button
              key={opt.key}
              className={`products-sort-pill ${sort === opt.key ? 'products-sort-pill--active' : ''}`}
              onClick={() => setSort(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* FILTER TABS */}
        <div className="products-filter-tabs">
          {['all', 'crops', 'poultry'].map(tab => (
            <button
              key={tab}
              className={`products-filter-tab ${typeFilter === tab ? 'products-filter-tab--active' : ''}`}
              onClick={() => setTypeFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/*FORM (conditionally shown) */}
        {selectedProduct !== null && (
          <ProductForm
            initialData={selectedProduct}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedProduct(null)}
          />
        )}

        {/* TABLE */}
        <div className="products-panel">
          <div className="products-panel-header">
            <span className="products-panel-title">
              ALL PRODUCTS ({filtered.length.toLocaleString()})
            </span>
            <button
              className="products-add-btn"
              onClick={() => setSelectedProduct({})}
            >
              Add Product
            </button>
          </div>

          <table className="products-table">
            <thead>
              <tr className="products-table-head-row">
                <th className="products-table-head">Product Name</th>
                <th className="products-table-head">Type</th>
                <th className="products-table-head">Quantity</th>
                <th className="products-table-head">Price</th>
                <th className="products-table-head">Total Income</th>
                <th className="products-table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.productId} className="products-table-row">
                  <td className="products-table-cell">{product.productName}</td>
                  <td className="products-table-cell">{typeLabel(product.productType)}</td>
                  <td className="products-table-cell">{product.productQuantity}</td>
                  <td className="products-table-cell">₱{product.price?.toFixed(2)}</td>
                  <td className="products-table-cell">₱{product.totalIncome?.toFixed(2)}</td>
                  <td className="products-table-cell">
                    <button onClick={() => setSelectedProduct(product)}>Edit</button>
                    <button onClick={() => deleteProduct(product.productId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="products-footer">
        <span className="products-footer-copy">© 2026 Logo Name – Department of Agriculture</span>
        <div className="products-footer-links">
          <Link to="/privacy" className="products-footer-link">Privacy</Link>
          <Link to="/terms" className="products-footer-link">Terms</Link>
          <Link to="/contact" className="products-footer-link">Contact</Link>
        </div>
      </footer>

    </div>
  )
}

export default ProductListings