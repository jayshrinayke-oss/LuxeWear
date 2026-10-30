
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import "./Cart.css"

function Cart({ cart, setCart }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [placedTotal, setPlacedTotal] = useState(0)

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  })

  const total = cart.reduce(
    (sum, product) =>
      sum +
      (product.discountPrice || product.price) *
        (product.quantity || 1),
    0
  )

  function increaseQuantity(index) {
    setCart((previousCart) =>
      previousCart.map((product, i) =>
        i === index
          ? { ...product, quantity: (product.quantity || 1) + 1 }
          : product
      )
    )
  }

  function decreaseQuantity(index) {
    setCart((previousCart) =>
      previousCart.map((product, i) =>
        i === index
          ? {
              ...product,
              quantity: Math.max(1, (product.quantity || 1) - 1),
            }
          : product
      )
    )
  }

  function removeFromCart(indexToRemove) {
    setCart((previousCart) =>
      previousCart.filter((_, index) => index !== indexToRemove)
    )
    toast.success("Product removed from cart")
  }

  function handleChange(event) {
    const { name, value } = event.target
    setCustomer((previous) => ({ ...previous, [name]: value }))
  }

  function placeOrder(event) {
    event.preventDefault()
    setPlacedTotal(total)
    setOrderNumber("LX" + Date.now().toString().slice(-8))
    setOrderPlaced(true)
    setCart([])
    setShowCheckout(false)
    window.scrollTo(0, 0)
    toast.success("Demo order placed successfully!")
  }

  if (orderPlaced) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <h1>Thank You for Your Order!</h1>
          <p>Your demo order confirmation number is:</p>
          <h2>{orderNumber}</h2>
          <p>Order total: ₹{placedTotal.toLocaleString("en-IN")}</p>
          <Link to="/shop" className="shop-button">
            CONTINUE SHOPPING ↗
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <p>YOUR SELECTION</p>
        <h1>Shopping Bag</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Discover something special for your wardrobe.</p>
          <Link to="/shop" className="shop-button">
            CONTINUE SHOPPING ↗
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((product, index) => (
              <div
                className="cart-item"
                key={`${product.id}-${index}`}
              >
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                />

                <div className="cart-item-info">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>

                  {product.selectedSize != null && (
                    <p className="cart-product-option">
                      Size: {product.selectedSize}
                    </p>
                  )}

                  {product.selectedColor != null && (
                    <p className="cart-product-option">
                      Color: {product.selectedColor}
                    </p>
                  )}

                  <strong>
                    ₹{(
                      product.discountPrice || product.price
                    ).toLocaleString("en-IN")}
                  </strong>

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(index)}
                      aria-label="Decrease quantity"
                      disabled={(product.quantity || 1) <= 1}
                    >
                      −
                    </button>

                    <span>{product.quantity || 1}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(index)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p>
                    Item total: ₹{(
                      (product.discountPrice || product.price) *
                      (product.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </p>

                  <button
                    type="button"
                    className="remove-cart-button"
                    onClick={() => removeFromCart(index)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Subtotal</p>
            <h2>₹{total.toLocaleString("en-IN")}</h2>
            <span>Shipping and taxes calculated at checkout.</span>

            <button
              type="button"
              className="checkout-button"
              onClick={() => setShowCheckout(!showCheckout)}
            >
              {showCheckout ? "CLOSE CHECKOUT" : "PROCEED TO CHECKOUT"}
            </button>

            <Link to="/shop">Continue Shopping</Link>
          </div>

          {showCheckout && (
            <section className="checkout-form-section">
              <h2>Checkout Details</h2>
              <p>Enter your details to place your demo order.</p>

              <form className="checkout-form" onSubmit={placeOrder}>
                <label>
                  Full Name
                  <input
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    name="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </label>

                <label>
                  Email Address
                  <input
                    name="email"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </label>

                <label>
                  Full Address
                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    required
                  />
                </label>

                <label>
                  City
                  <input
                    name="city"
                    value={customer.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </label>

                <label>
                  PIN Code
                  <input
                    name="pincode"
                    type="text"
                    value={customer.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                </label>

                <div className="checkout-total">
                  <span>Order Total</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>

                <button className="checkout-button" type="submit">
                  PLACE DEMO ORDER
                </button>

                <p className="checkout-note">
                  Demo only. No payment is collected, and the order
                  is not saved to a real store.
                </p>
              </form>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default Cart
