import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/admin/ProductListings.css'

function ProductListings() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  // Create modal state
  const [createProduct, setCreateProduct] = useState(null)
  const [createForm, setCreateForm] = useState({
    productName: '',
    productType: '',
    price: '',
    productQuantity: '',
    productDescription: '',
  })
  const [createImageFile, setCreateImageFile] = useState(null)

  // Edit modal state
  const [editProduct, setEditProduct] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [imageFile, setImageFile] = useState(null)

  const navigate = useNavigate()
  const getToken = () => localStorage.getItem('token')

  const fetchProducts = async () => {
    try {
      let url = '/api/products'
      if (sortField) {
        url += `?sort=${sortField}&order=${sortDir}`
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setProducts(data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchProducts() }, [sortField, sortDir])
  useEffect(() => { applyFilters() }, [products, search, typeFilter])

  const applyFilters = () => {
    let result = [...products]

    if (typeFilter === 'crops') result = result.filter(p => p.productType === 1)
    if (typeFilter === 'poultry') result = result.filter(p => p.productType === 2)

    if (search) {
      result = result.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFiltered(result)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortIndicator = (field) => {
    if (sortField !== field) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  const handleCreateOpen = () => {
    setCreateProduct({})
    setCreateForm({
      productName: '',
      productType: '',
      price: '',
      productQuantity: '',
      productDescription: '',
    })
    setCreateImageFile(null)
  }

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value })
  }

  const handleCreateSave = async () => {
    try {
      const formData = new FormData()
      formData.append('productName', createForm.productName)
      formData.append('productType', createForm.productType)
      formData.append('productQuantity', createForm.productQuantity)
      formData.append('price', createForm.price)
      formData.append('productDescription', createForm.productDescription)
      
      if (createImageFile) {
        formData.append('productImage', createImageFile)
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      })

      const data = await res.json()
      
      if (data.inserted) {
        setCreateProduct(null)
        setCreateForm({
          productName: '',
          productType: '',
          price: '',
          productQuantity: '',
          productDescription: '',
        })
        setCreateImageFile(null)
        fetchProducts()
      } else {
        alert('Error: ' + (data.error || 'Failed to create'))
      }
    } catch (err) { console.error(err) }
  }

  const handleEdit = (p) => {
    setEditProduct(p)
    setEditForm({
      productName: p.productName || '',
      productType: p.productType || '',
      price: p.price || '',
      productQuantity: p.productQuantity || '',
      productDescription: p.productDescription || '',
      imageUrl: p.imageUrl || ''
    })
    setImageFile(null)
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSave = async () => {
    try {
      const id = editProduct.productId || editProduct._id

      let options = {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` }
      }

      if (imageFile) {
        const formData = new FormData()
        formData.append('productImage', imageFile)
        formData.append('productName', editForm.productName)
        formData.append('productType', editForm.productType)
        formData.append('price', editForm.price)
        formData.append('productQuantity', editForm.productQuantity)
        formData.append('productDescription', editForm.productDescription)
        options.body = formData
      } else {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify({
          productName: editForm.productName,
          productType: Number(editForm.productType),
          price: Number(editForm.price),
          productQuantity: Number(editForm.productQuantity),
          productDescription: editForm.productDescription,
          imageUrl: editForm.imageUrl
        })
      }

      await fetch(`/api/products/${id}`, options)
      setEditProduct(null)
      fetchProducts()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    fetchProducts()
  }

  const handleLogout = () => { localStorage.clear(); navigate('/login') }

  const typeLabel = (type) => {
    if (type === 1) return 'Crops'
    if (type === 2) return 'Poultry'
    return '—'
  }

  return (
    <div className="products-wrapper">

      {/* ── NAVIGATION BAR ── */}
      <nav className="products-nav">
        <Link to="/admin/dashboard" className="products-nav-logo">
          <img src={logo} alt="Logo" className="products-nav-logo-img" />
        </Link>
        <div className="products-nav-right">
          <Link to="/admin/dashboard" className="products-nav-link">Dashboard</Link>
          <Link to="/admin/orders" className="products-nav-link">Orders</Link>
          <Link to="/admin/sales" className="products-nav-link">Sales</Link>
          <Link to="/admin/users" className="products-nav-link">Users</Link>
          <button className="products-logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="products-main">
        <h1 className="products-heading">Listed Products</h1>

        {/* SEARCH + TYPE */}
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
            <option value="all">All Types ▾</option>
            <option value="crops">Crops</option>
            <option value="poultry">Poultry</option>
          </select>
        </div>

        {/* SORT PILLS */}
        <div className="products-sort-row">
          <span className="products-sort-label">Sort:</span>
          {[
            { key: 'productName', label: 'Name' },
            { key: 'productType', label: 'Type' },
            { key: 'price', label: 'Price' },
            { key: 'productQuantity', label: 'Quantity' },
          ].map(s => (
            <button
              key={s.key}
              className={`products-sort-pill${sortField === s.key ? ' products-sort-pill--active' : ''}`}
              onClick={() => handleSort(s.key)}
            >
              {s.label}{sortIndicator(s.key)}
            </button>
          ))}
        </div>

        {/* PANEL + TABLE */}
        <div className="products-panel">
          <div className="products-panel-header">
            <span className="products-panel-title">All Products ({filtered.length})</span>
            <button className="products-create-btn" onClick={handleCreateOpen}>+ Add Product</button>
          </div>

          {filtered.length === 0 ? (
            <div className="products-empty">No products found.</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr className="products-table-head-row">
                  <th className="products-table-head" onClick={() => handleSort('productName')}>
                    Product Name{sortIndicator('productName')}
                  </th>
                  <th className="products-table-head" onClick={() => handleSort('productType')}>
                    Type{sortIndicator('productType')}
                  </th>
                  <th className="products-table-head" onClick={() => handleSort('productQuantity')}>
                    Quantity{sortIndicator('productQuantity')}
                  </th>
                  <th className="products-table-head" onClick={() => handleSort('price')}>
                    Price{sortIndicator('price')}
                  </th>
                  <th className="products-table-head">Description</th>
                  <th className="products-table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.productId || p._id} className="products-table-row">
                    <td className="products-table-cell" style={{ fontWeight: 600 }}>{p.productName}</td>
                    <td className="products-table-cell">
                      <span className={`products-type-badge products-type-badge--${p.productType === 1 ? 'crops' : 'poultry'}`}>
                        {typeLabel(p.productType)}
                      </span>
                    </td>
                    <td className="products-table-cell">{p.productQuantity}</td>
                    <td className="products-table-cell">₱{Number(p.price).toFixed(2)}</td>
                    <td className="products-table-cell" style={{ maxWidth: 200, color: '#4a7a3a', fontSize: '0.78rem' }}>
                      {p.productDescription || '—'}
                    </td>
                    <td className="products-table-cell">
                      <div className="products-action-btns">
                        <button className="products-edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="products-delete-btn" onClick={() => handleDelete(p.productId || p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ── CREATE MODAL ── */}
      {createProduct !== null && (
        <div className="products-modal-overlay" onClick={() => setCreateProduct(null)}>
          <div className="products-modal" onClick={e => e.stopPropagation()}>
            <h2 className="products-modal-title">Add New Product</h2>

            <div className="products-modal-field">
              <label className="products-modal-label">Product Name</label>
              <input className="products-modal-input" name="productName" value={createForm.productName} onChange={handleCreateChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Type</label>
              <select className="products-modal-select" name="productType" value={createForm.productType} onChange={handleCreateChange}>
                <option value="">Select type</option>
                <option value="1">Crops</option>
                <option value="2">Poultry</option>
              </select>
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Price (₱)</label>
              <input className="products-modal-input" name="price" type="number" value={createForm.price} onChange={handleCreateChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Quantity</label>
              <input className="products-modal-input" name="productQuantity" type="number" value={createForm.productQuantity} onChange={handleCreateChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Description</label>
              <textarea className="products-modal-textarea" name="productDescription" value={createForm.productDescription} onChange={handleCreateChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Product Image</label>
              <input type="file" accept="image/*" onChange={e => setCreateImageFile(e.target.files[0])} style={{ fontSize: '0.82rem' }} />
            </div>

            <div className="products-modal-actions">
              <button className="products-modal-cancel" onClick={() => setCreateProduct(null)}>Cancel</button>
              <button className="products-modal-save" onClick={handleCreateSave}>Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editProduct && (
        <div className="products-modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="products-modal" onClick={e => e.stopPropagation()}>
            <h2 className="products-modal-title">Edit Product</h2>

            <div className="products-modal-field">
              <label className="products-modal-label">Product Name</label>
              <input className="products-modal-input" name="productName" value={editForm.productName} onChange={handleEditChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Type</label>
              <select className="products-modal-select" name="productType" value={editForm.productType} onChange={handleEditChange}>
                <option value="">Select type</option>
                <option value="1">Crops</option>
                <option value="2">Poultry</option>
              </select>
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Price (₱)</label>
              <input className="products-modal-input" name="price" type="number" value={editForm.price} onChange={handleEditChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Quantity</label>
              <input className="products-modal-input" name="productQuantity" type="number" value={editForm.productQuantity} onChange={handleEditChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Description</label>
              <textarea className="products-modal-textarea" name="productDescription" value={editForm.productDescription} onChange={handleEditChange} />
            </div>

            <div className="products-modal-field">
              <label className="products-modal-label">Replace Image (optional)</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '0.82rem' }} />
            </div>

            <div className="products-modal-actions">
              <button className="products-modal-cancel" onClick={() => setEditProduct(null)}>Cancel</button>
              <button className="products-modal-save" onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
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