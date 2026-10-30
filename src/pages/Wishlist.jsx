
import { Link } from 'react-router-dom'
import './Wishlist.css'

function Wishlist({ wishlist, setWishlist, setCart }) {
  function removeFromWishlist(id) {
    setWishlist((previous) =>
      previous.filter((product) => product.id !== id)
    )
  }

  function addToCart(product) {
    setCart((previous) => {
      const existing = previous.find(
        (item) => item.id === product.id
      )

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      }

      return [...previous, { ...product, quantity: 1 }]
    })
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-heading">
        <p>YOUR PERSONAL COLLECTION</p>
        <h1>My Wishlist ♡</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your wishlist is empty</h2>
          <p>Save your favourite styles here.</p>
          <Link to="/shop" className="shop-button">
            EXPLORE COLLECTION ↗
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <article className="wishlist-card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img src={product.images[0]} alt={product.name} />
              </Link>

              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <strong>
                ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
              </strong>

              <button
                className="wishlist-cart-button"
                onClick={() => addToCart(product)}
              >
                ADD TO CART
              </button>

              <button
                className="wishlist-remove-button"
                onClick={() => removeFromWishlist(product.id)}
              >
                REMOVE ♡
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Wishlist
