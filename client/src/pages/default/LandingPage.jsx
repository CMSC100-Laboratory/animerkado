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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?sort=productName&order=asc')
        const data = await res.json()
        setFeaturedProducts(data.slice(0, 6))
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const objectivesData = [
    {
      icon: '🌾',
      title: 'Direct Trade',
      description: 'A consistent platform where farmers can directly trade agricultural products with consumers.',
    },
    {
      icon: '🌾',
      title: 'Smart Management',
      description: "Streamlines the Department of Agriculture's products, orders, and sales transactions.",
    },
    {
      icon: '🌾',
      title: 'Farmer Support',
      description: 'Empowers small farmers and opens public markets through accessible digital commerce.',
    },
    {
      icon: '🌾',
      title: 'User-friendly',
      description: 'A secure and simple shopping experience built for every kind of customer.',
    },
  ]

  const productsPerSlide = 3

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(featuredProducts.length / productsPerSlide) - 1 : prev - 1
    )
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === Math.ceil(featuredProducts.length / productsPerSlide) - 1 ? 0 : prev + 1
    )
  }

  const visibleProducts = featuredProducts.slice(
    currentSlide * productsPerSlide,
    currentSlide * productsPerSlide + productsPerSlide
  )

  const totalSlides = Math.ceil(featuredProducts.length / productsPerSlide)

  return (
    <div className="landing-wrapper">

      {/* Navigation Bar */}
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

      {/* Hero */}
      <section className="hero-section" style={{ backgroundImage: `url(${landingBg})` }}>
        <div className="hero-content">
          <img src={heroLogo} alt="AniMerkado" className="hero-title-img" />
          <p className="hero-subtitle">Fresh products straight from local farms</p>
          <Link to="/shop" className="hero-cta">Shop Now</Link>
        </div>
      </section>

      {/* Objectives */}
      <section className="objectives-section">
        <div className="objectives-group">
          {objectivesData.map((obj, i) => (
            <div className="objective-card" key={obj.title} style={{ '--i': i }}>
              <div className="objective-icon">{obj.icon}</div>
              <h3>{obj.title}</h3>
              <p>{obj.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products-section">
        <div className="featured-products-header">
          <div className="featured-title-group">
            <span className="featured-eyebrow">Freshly Listed</span>
            <h2 className="featured-products-title">Featured Products</h2>
          </div>
          <div className="featured-products-controls">
            <button
              className="carousel-btn prev"
              onClick={handlePrevSlide}
              aria-label="Previous products"
              disabled={featuredProducts.length <= productsPerSlide}
            >←</button>
            <span className="carousel-dots">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <span
                  key={i}
                  className={`carousel-dot${i === currentSlide ? ' active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </span>
            <button
              className="carousel-btn next"
              onClick={handleNextSlide}
              aria-label="Next products"
              disabled={featuredProducts.length <= productsPerSlide}
            >→</button>
          </div>
        </div>

        {loading ? (
          <div className="landing-empty">Loading products...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="landing-empty">No products available.</div>
        ) : (
          <div className="products-grid">
            {visibleProducts.map((product, i) => (
              <div className="product-card" key={product.productId} style={{ '--i': i }}>
                <div className="product-image">
                  {product.productImage ? (
                    <img
                      src={`http://localhost:5000${product.productImage}`}
                      alt={product.productName}
                    />
                  ) : (
                    <span className="product-image-placeholder">No Image</span>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-name">{product.productName}</div>
                  {product.productDescription && (
                    <div className="product-description">{product.productDescription}</div>
                  )}
                  <div className="product-price-row">
                    <span className="product-price">₱{product.price.toFixed(2)}</span>
                    <Link to="/shop" className="product-shop-link">View →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="featured-cta-row">
          <Link to="/shop" className="featured-browse-btn">Browse All Products</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="footer-copy">© 2026 AniMerkado – Department of Agriculture</span>
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