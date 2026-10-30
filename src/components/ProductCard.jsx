
import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import { toast } from "react-hot-toast"

function ProductCard({
  product,
  onAddToCart,
  wishlist = [],
  setWishlist,
}) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  const price = product.discountPrice || product.price

  const isWishlisted = wishlist.some(
    (item) => String(item.id) === String(product.id)
  )

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()

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
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1,
    })

    toast.success("Added to cart!")
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <Link
          to={`/product/${product.id}`}
          className="product-details-link"
        >
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
          />
        </Link>

        {product.tags?.includes("new") && (
          <span className="product-badge">NEW</span>
        )}

        <button
          type="button"
          className={`wishlist-heart ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            size={20}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link
          to={`/product/${product.id}`}
          className="product-name-link"
        >
          <h3>{product.name}</h3>
        </Link>

        <div className="product-price">
          <span>₹{price.toLocaleString("en-IN")}</span>
          {product.discountPrice && (
            <del>₹{product.price.toLocaleString("en-IN")}</del>
          )}
        </div>

        <p className="product-rating">★ {product.rating} / 5</p>

        {product.sizes?.length > 0 && (
          <div className="product-availability">
            <p>
              Size: <strong>{selectedSize || "Optional"}</strong>
            </p>
            <div className="available-options">
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={selectedSize === size ? "selected" : ""}
                  aria-pressed={selectedSize === size}
                  onClick={() =>
                    setSelectedSize((previous) =>
                      previous === size ? "" : size
                    )
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="product-availability">
            <p>
              Color: <strong>{selectedColor || "Optional"}</strong>
            </p>
            <div className="available-options">
              {product.colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={selectedColor === color ? "selected" : ""}
                  aria-pressed={selectedColor === color}
                  onClick={() =>
                    setSelectedColor((previous) =>
                      previous === color ? "" : color
                    )
                  }
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className="add-cart-button"
          onClick={handleAddToCart}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default ProductCard
