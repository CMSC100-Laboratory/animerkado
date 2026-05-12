import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import landingBg from '../../assets/bg.jpeg'
import '../../styles/default/LandingPage.css'
import heroLogo from '../../assets/animerkado_text.png'

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?sort=productName&order=asc')
        const data = await res.json()
        setFeaturedProducts(data.slice(0, 6)) // limit to 6 products
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const objectivesData = [
    { title: 'Objective 1', description: 'To provide a consistent platform wherein farmers can directly trade agricultural products.' },
    { title: 'Objective 2', description: 'To help the Department of Agriculture&apos;s products, orders, and sales transactions.' },
    { title: 'Objective 3', description: 'To support small farmers and create public markets through digital commerce solutions.' },
    { title: 'Objective 4', description: 'To create a secure and user-friendly shopping experience for customers.' },
  ]

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(featuredProducts.length / 3) - 1 : prev - 1
    )
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === Math.ceil(featuredProducts.length / 3) - 1 ? 0 : prev + 1
    )
  }

  const productsPerSlide = 3
  const visibleProducts = featuredProducts.slice(
    currentSlide * productsPerSlide,
    currentSlide * productsPerSlide + productsPerSlide
  )

  return (
    <div className="landing-wrapper">
      {/* ===== NAVIGATION BAR ===== */}
      <nav className="landing-nav">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="AniMerkado Logo" className="nav-logo-img" />
          <span className="nav-logo-text">AniMerkado</span>
        </Link>

        <div className="nav-right">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/login" className="nav-btn nav-btn-login">Login</Link>
          <Link to="/register" className="nav-btn nav-btn-register">Register</Link>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${landingBg})` }}
      >
        <div className="hero-content">
          <img src={heroLogo} alt="AniMerkado" className="hero-title-img"/>
          <p className="hero-subtitle">Fresh products straight from local farms</p>
          <Link to="/shop" className="hero-cta">Shop Now</Link>
        </div>
      </section>

      {/* ===== OBJECTIVES ===== */}
      <section className="objectives-section">
        <div className="objectives-group">
          {objectivesData.map((objective) => (
            <div className="objective-card" key={objective.title}>
              <div className="objective-icon">🌱</div>
              <h3>{objective.title}</h3>
              <p>{objective.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="featured-products-section">
        <div className="featured-products-header">
          <h2 className="featured-products-title">FEATURED PRODUCTS</h2>
          <div className="featured-products-controls">
            <button
              className="carousel-btn prev"
              onClick={handlePrevSlide}
              aria-label="Previous products"
              disabled={featuredProducts.length <= productsPerSlide}
            >
              ←
            </button>
            <button
              className="carousel-btn next"
              onClick={handleNextSlide}
              aria-label="Next products"
              disabled={featuredProducts.length <= productsPerSlide}
            >
              →
            </button>
          </div>
        </div>

        {loading ? (
          <div className="landing-empty">Loading products...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="landing-empty">No products found.</div>
        ) : (
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <div className="product-card" key={product.productId}>
                <div className="product-image">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : 'Product Image'}
                </div>
                <div className="product-info">
                  <div className="product-name">{product.productName}</div>
                  <div className="product-description">{product.productDescription}</div>
                  <div className="product-price">₱{product.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <span className="footer-copy">
          © 2026 AniMerkado – Department of Agriculture
        </span>
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/terms" className="footer-link">Terms</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
