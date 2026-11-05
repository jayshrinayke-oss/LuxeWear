
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, X } from 'lucide-react'
import './App.css'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import products from './data/products.json'

function Home() {
  const sections = [
    { title: "Men's Clothing", keywords: ['men', 'mens'] },
    { title: "Women's Clothing", keywords: ['women', 'womens', 'female'] },
    { title: 'Shoes', keywords: ['shoe', 'footwear'] },
    { title: 'Accessories', keywords: ['accessor', 'bag', 'watch'] },
    { title: 'Best Sellers', keywords: [] },
  ]

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">THE NEW SEASON COLLECTION</p>
          <h1>Style That<br />Speaks For You.</h1>
          <p className="hero-description">
            Discover timeless fashion designed for
            those who appreciate the finer things.
          </p>
          <Link to="/shop" className="shop-button">
            EXPLORE COLLECTION ↗
          </Link>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
            alt="Elegant fashion collection"
          />
          <div className="image-label">
            <span>01 / NEW ARRIVALS</span>
            <span>TIMELESS ELEGANCE</span>
          </div>
        </div>
      </section>

      <section className="intro" id="about">
        <p>LESS, BUT BETTER.</p>
        <h2>Elevate Your Everyday.</h2>
        <span>Thoughtfully curated fashion for every moment.</span>
      </section>

      {sections.map((section, index) => {
        const sectionProducts = section.keywords.length === 0
          ? products.slice(0, 8)
          : products.filter(product =>
              section.keywords.some(keyword =>
                product.category.toLowerCase().includes(keyword)
              )
            ).slice(0, 8)

        if (sectionProducts.length === 0) return null

        return (
         <section
  className="product-section"
  id={section.title === 'Best Sellers' ? 'best-sellers' : undefined}
  key={section.title}
>
            <div className="product-section-heading">
              <div>
                <p className="eyebrow">
                  {index === 4 ? 'CUSTOMER FAVOURITES' : 'EXPLORE THE COLLECTION'}
                </p>
                <h2>{section.title}</h2>
              </div>

              <Link to="/shop" className="view-all">
                VIEW ALL ↗
              </Link>
            </div>

            <div className="product-carousel">
              {sectionProducts.map(product => (
                <Link
                  to={`/product/${product.id}`}
                  className="home-product-card"
                  key={product.id}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                  />
                  <h3>{product.name}</h3>
                  <p>
                    ₹{(product.discountPrice || product.price)
                      .toLocaleString('en-IN')}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}

function App() {
  const [cart, setCart] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('luxe-cart')) || []
  } catch {
    return []
  }
})

const [wishlist, setWishlist] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('luxe-wishlist')) || []
  } catch {
    return []
  }
})

useEffect(() => {
  localStorage.setItem('luxe-cart', JSON.stringify(cart))
}, [cart])

useEffect(() => {
  localStorage.setItem('luxe-wishlist', JSON.stringify(wishlist))
}, [wishlist])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const searchResults = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.trim().toLowerCase())
  )

  function handleSearch(event) {
    event.preventDefault()

    if (!searchText.trim()) return

    navigate('/shop', {
      state: { searchQuery: searchText.trim() },
    })

    setSearchOpen(false)
  }

  function selectProduct(product) {
    setSearchText(product.name)

    navigate('/shop', {
      state: { searchQuery: product.name },
    })

    setSearchOpen(false)
  }

  return (
    <div className="website">
      <div className="announcement">
        FREE SHIPPING ON ORDERS ABOVE ₹1999
      </div>

      <header className="navbar">
        <Link to="/" className="logo">
          LUXEWEAR<span>.</span>
        </Link>

        <nav>
  <Link to="/">Home</Link>
  <Link to="/shop">Products</Link>
  <a href="/#best-sellers">Best Sellers</a>
  <a href="/#about">About</a>
  <a href="/#contact">Contact</a>
</nav>

        <div className="nav-icons">
          <button
            aria-label="Search products"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? (
              <X size={21} strokeWidth={1.5} />
            ) : (
              <Search size={21} strokeWidth={1.5} />
            )}
          </button>

          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} items`}
            title="My Wishlist"
          >
            <span aria-hidden="true">
              {wishlist.length > 0 ? '♥' : '♡'}
            </span>
            <span className="cart-count">{wishlist.length}</span>
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping bag, ${cart.length} items`}
            className="cart-link"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="cart-count">{cart.length}</span>
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div className="search-overlay">
          <form className="search-panel" onSubmit={handleSearch}>
            <label htmlFor="product-search">
              WHAT ARE YOU LOOKING FOR?
            </label>

            <div className="search-input-row">
              <Search size={21} />

              <input
                id="product-search"
                type="search"
                placeholder="Search clothes, shoes, accessories..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                autoFocus
              />

              <button type="submit">SEARCH ↗</button>
            </div>

            {searchText.trim() ? (
              <div className="search-results">
                <p className="search-result-heading">
                  {searchResults.length} matching product(s)
                </p>

                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <button
                      type="button"
                      className="search-result-item"
                      key={product.id}
                      onClick={() => selectProduct(product)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                      />

                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.category}</small>
                      </span>

                      <span className="search-result-price">
                        ₹{(product.discountPrice || product.price)
                          .toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="search-empty">
                    No products found. Try another name.
                  </p>
                )}
              </div>
            ) : (
              <p className="popular-searches">
                POPULAR: Blazer · Shoes · Accessories
              </p>
            )}
          </form>

          <button
            className="search-backdrop"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/shop"
          element={
            <Shop
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          }
        />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              setWishlist={setWishlist}
              setCart={setCart}
            />
          }
        />

        <Route
          path="*"
          element={
            <main className="shop-heading">
              <h1>Page Not Found</h1>
              <Link to="/">Return Home</Link>
            </main>
          }
        />
      </Routes>

      <footer id="contact" className="site-footer">
  <div className="footer-content">
    <div>
      <h2>LUXEWEAR.</h2>
      <p>Timeless style. Modern living.</p>
    </div>

    <div>
      <h3>SHOP</h3>
      <Link to="/shop">All Products</Link>
      <Link to="/shop">Men's Collection</Link>
      <Link to="/shop">Women's Collection</Link>
      <Link to="/shop">Accessories</Link>
    </div>

    <div>
      <h3>QUICK LINKS</h3>
      <Link to="/">Home</Link>
      <a href="/#about">About Us</a>
      <a href="/#best-sellers">Best Sellers</a>
      <Link to="/wishlist">Wishlist</Link>
      <Link to="/cart">Shopping Cart</Link>
    </div>

    <div>
      <h3>HELP</h3>
      <a href="mailto:support@luxewear.com">Contact Us</a>
      <a href="/#contact">Customer Support</a>
    </div>
  </div>

  <p className="copyright">© 2026 LuxeWear. All rights reserved.</p>
</footer>
    </div>
  )
}

export default App
