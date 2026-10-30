
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ShoppingBag, Heart } from "lucide-react"
import products from "../data/products.json"
import { toast } from "react-hot-toast"
import "./ProductDetails.css"

function ProductDetails({
  setCart,
  wishlist = [],
  setWishlist,
}) {
  const { id } = useParams()

  const product = products.find(
    (item) => String(item.id) === String(id)
  )

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  if (!product) {
    return (
      <main className="product-details">
        <h2>Product not found</h2>
        <Link to="/shop">Back to Shop</Link>
      </main>
    )
  }

  const price = product.discountPrice || product.price

  const isWishlisted = wishlist.some(
    (item) => String(item.id) === String(product.id)
  )

  function handleWishlist() {
    if (!setWishlist) return

    if (isWishlisted) {
      setWishlist((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(product.id)
        )
      )
      toast.success("Removed from wishlist")
    } else {
      setWishlist((previous) => [...previous, product])
      toast.success("Added to wishlist!")
    }
  }

 
function handleAddToCart() {
  setCart((previousCart) => {
    const existingIndex = previousCart.findIndex(
      (item) =>
        String(item.id) === String(product.id) &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    )

    if (existingIndex !== -1) {
      return previousCart.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      )
    }

    return [
      ...previousCart,
      {
        ...product,
        selectedSize: selectedSize || "",
        selectedColor: selectedColor || "",
        quantity: 1,
      },
    ]
  })

  toast.success("Added to cart!")
}


  return (
    <main className="product-details">
      <div className="details-image">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
        />
      </div>

      <div className="details-info">
        <p className="details-category">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="details-rating">★ {product.rating} / 5</p>

        <div className="details-price">
          <strong>₹{price.toLocaleString("en-IN")}</strong>
          {product.discountPrice && (
            <del>
              ₹{product.price.toLocaleString("en-IN")}
            </del>
          )}
        </div>

        <p className="details-description">
          {product.description ||
            "Discover timeless style with this carefully selected LuxeWear piece."}
        </p>

        {product.sizes?.length > 0 && (
          <div className="details-option">
            <h3>Select Size</h3>
            <div className="option-list">
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={
                    selectedSize === size
                      ? "option-button selected"
                      : "option-button"
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="details-option">
            <h3>Select Color</h3>
            <div className="option-list">
              {product.colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={
                    selectedColor === color
                      ? "option-button selected"
                      : "option-button"
                  }
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          disabled={!setWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 18px",
            marginBottom: "12px",
            cursor: "pointer",
            background: isWishlisted ? "#f5e9e7" : "white",
            border: "1px solid #d8d1c7",
            color: "#6e5147",
          }}
        >
          <Heart
            size={18}
            fill={isWishlisted ? "currentColor" : "none"}
          />
          {isWishlisted
            ? "SAVED TO WISHLIST"
            : "ADD TO WISHLIST"}
        </button>

        <button
          type="button"
          className="details-add-button"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={18} />
          ADD TO CART
        </button>

        <Link to="/shop" className="back-to-shop">
          ← Continue Shopping
        </Link>
      </div>
    </main>
  )
}

export default ProductDetails
