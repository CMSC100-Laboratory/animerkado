import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/admin/ProductListings.css'

function ProductListings() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortField, setSortField] = useState('productName')
  const [sortOrder, setSortOrder] = useState('asc')

  const [form, setForm] = useState({
    productId: '',
    productName: '',
    productType: '',
    price: '',
    productQuantity: '',
    productDescription: '',
    imageUrl: ''
  })

  const [imageMode, setImageMode] = useState('url') // "url" | "upload"
  const [imageFile, setImageFile] = useState(null)

  const navigate = useNavigate()

  const getToken = () => localStorage.getItem('token')

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, search, typeFilter, sortField, sortOrder])

  // ================= FILTERS =================
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const applyFilters = () => {
    let result = [...products]

    if (typeFilter === 'crops') result = result.filter(p => p.productType === 1)
    if (typeFilter === 'poultry') result = result.filter(p => p.productType === 2)

    if (search) {
      result = result.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    result.sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA
    })

    setFiltered(result)
  }

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const isEdit = !!form.productId

      let url = isEdit
        ? `http://localhost:5000/api/products/${form.productId}`
        : 'http://localhost:5000/api/products'

      let options = {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }

      // ================= IMAGE HANDLING =================
      if (imageMode === 'upload' && imageFile) {
        const formData = new FormData()

        formData.append('productName', form.productName)
        formData.append('productType', form.productType)
        formData.append('price', form.price)
        formData.append('productQuantity', form.productQuantity)
        formData.append('productDescription', form.productDescription)
        formData.append('productImage', imageFile)

        options.body = formData
      } else {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify({
          ...form,
          imageUrl: form.imageUrl
        })
      }

      const res = await fetch(url, options)
      const data = await res.json()

      console.log(data)

      setForm({
        productId: '',
        productName: '',
        productType: '',
        price: '',
        productQuantity: '',
        productDescription: '',
        imageUrl: ''
      })

      setImageFile(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  // ================= EDIT =================
  const handleEdit = (p) => {
    setForm({
      productId: p.productId || p._id,
      productName: p.productName,
      productType: p.productType,
      price: p.price,
      productQuantity: p.productQuantity,
      productDescription: p.productDescription,
      imageUrl: p.imageUrl || ''
    })
  }

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    })

    fetchProducts()
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const typeLabel = (type) => {
    if (type === 1) return 'Crops'
    if (type === 2) return 'Poultry'
    return '—'
  }

  return (
    <div className="products-wrapper">

      <nav className="products-nav">
        <Link to="/admin/dashboard" className="products-nav-logo">
          <img src={logo} alt="Logo" className="products-nav-logo-img" />
        </Link>
        <button className="products-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      <main className="products-main">
        <h1 className="products-heading">LISTED PRODUCTS</h1>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Name"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
          />

          <input
            name="productQuantity"
            value={form.productQuantity}
            onChange={handleChange}
            placeholder="Quantity"
          />

          <input
            name="productDescription"
            value={form.productDescription}
            onChange={handleChange}
            placeholder="Description"
          />

          {/* IMAGE MODE */}
          <div>
            <label>
              <input
                type="radio"
                checked={imageMode === 'url'}
                onChange={() => setImageMode('url')}
              />
              Image URL
            </label>

            <label>
              <input
                type="radio"
                checked={imageMode === 'upload'}
                onChange={() => setImageMode('upload')}
              />
              Upload File
            </label>
          </div>

          {imageMode === 'url' ? (
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
            />
          ) : (
            <input type="file" onChange={handleFileChange} />
          )}

          <button type="submit">
            {form.productId ? 'Update' : 'Add'}
          </button>
        </form>

        {/* SORT PILLS */}
        <div className="products-sort-row">
          <span className="products-sort-label">Sort by:</span>
          {[
            { label: 'Name',     field: 'productName' },
            { label: 'Price',    field: 'price' },
            { label: 'Quantity', field: 'productQuantity' },
          ].map(({ label, field }) => (
            <button
              key={field}
              className={`products-sort-pill ${sortField === field ? 'products-sort-pill--active' : ''}`}
              onClick={() => handleSort(field)}
            >
              {label} {sortField === field ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
          ))}
        </div>

        <div className="products-sort-row">
          {[['all', 'All'], ['crops', 'Crops'], ['poultry', 'Poultry']].map(([val, label]) => (
            <button
              key={val}
              className={`products-sort-pill ${typeFilter === val ? 'products-sort-pill--active' : ''}`}
              onClick={() => setTypeFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.productId || p._id}>
                <td>
                  <img
                    src={p.imageUrl || 'https://placeholder.co/50'}
                    width="50"
                  />
                </td>
                <td>{p.productName}</td>
                <td>{typeLabel(p.productType)}</td>
                <td>{p.productQuantity}</td>
                <td>{p.price}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.productId || p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default ProductListings