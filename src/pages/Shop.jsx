
import { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import { useLocation } from "react-router-dom"
import products from "../data/products.json"
import ProductCard from "../components/ProductCard"
import "./Shop.css"

function Shop({
  cart,
  setCart,
  wishlist = [],
  setWishlist,
}) {
  const location = useLocation()

  const [search, setSearch] = useState(
    location.state?.searchQuery || ""
  )
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("default")

  useEffect(() => {
    setSearch(location.state?.searchQuery || "")
  }, [location.state?.searchQuery])

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setSort("default")
  }

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ]

  let filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim()

    const matchesSearch =
      (product.name || "").toLowerCase().includes(searchText) ||
      (product.category || "").toLowerCase().includes(searchText) ||
      (product.tags || []).some((tag) =>
        String(tag).toLowerCase().includes(searchText)
      )

    const matchesCategory =
      category === "All" || product.category === category

    return matchesSearch && matchesCategory
  })

  if (sort === "low") {
    filteredProducts.sort(
      (a, b) =>
        (a.discountPrice || a.price) -
        (b.discountPrice || b.price)
    )
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) =>
        (b.discountPrice || b.price) -
        (a.discountPrice || a.price)
    )
  }

  function handleAddToCart(productToAdd) {
    setCart((previousCart) => {
      const existingIndex = previousCart.findIndex(
        (item) =>
          String(item.id) === String(productToAdd.id) &&
          item.selectedSize === productToAdd.selectedSize &&
          item.selectedColor === productToAdd.selectedColor
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

      return [...previousCart, productToAdd]
    })

    toast.success("Added to cart!")
  }

  return (
    <main className="shop-page">
      <Toaster position="top-right" />

      <div className="shop-heading">
        <p>THE LUXEWEAR COLLECTION</p>
        <h1>Discover Your Style</h1>
        <span>
          Thoughtfully selected pieces for your wardrobe.
        </span>
      </div>

      <div className="shop-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Categories" : item}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>

        <button
          type="button"
          className="clear-filters"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      <div className="shop-toolbar">
        <p>{filteredProducts.length} Products</p>
        <span>TIMELESS · MODERN · ELEGANT</span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h2>No products found</h2>
          <p>Try another search or clear your filters.</p>
          <button
            type="button"
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  )
}

export default Shop
