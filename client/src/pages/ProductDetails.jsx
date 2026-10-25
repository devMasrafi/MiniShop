import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { FaArrowLeft, FaBoxOpen, FaCheckCircle } from 'react-icons/fa'
import { apiFetch } from '../utils/api'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Loading the product.
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [isAdding, setIsAdding] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const [cartError, setCartError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const getProduct = async () => {
      setIsLoading(true)
      setError('')
      setProduct(null)
      setSelectedVariant(null)
      setQuantity(1)
      setCartMessage('')
      setCartError('')

      try {
        const result = await apiFetch(`/products/${id}`, {
          signal: controller.signal,
        })

        if (!result.success || !result.data) {
          throw new Error('The server returned an unexpected product response.')
        }

        setProduct(result.data)

        const variants = Array.isArray(result.data.variants)
          ? result.data.variants
          : []

        if (variants.length > 0) {
          const availableVariant = variants.find(
            (variant) => Number(variant.stock) > 0
          )

          setSelectedVariant(availableVariant || variants[0])
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(
            err.status === 404
              ? 'This product could not be found.'
              : err.message || 'Something went wrong.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    getProduct()

    return () => controller.abort()
  }, [id])

  if (isLoading) {
    return (
      <main className="text-muted mx-auto max-w-7xl px-5 py-16 sm:px-8">
        Loading product details...
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="border-border rounded-xl border p-8">
          <h1 className="text-2xl font-semibold">Product unavailable</h1>
          <p className="text-muted mt-3">
            {error || 'We could not find this product.'}
          </p>
          <Link
            to="/products"
            className="bg-ascent mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-3 text-white"
          >
            <FaArrowLeft /> Back to products
          </Link>
        </div>
      </main>
    )
  }

  const variants = Array.isArray(product.variants) ? product.variants : []
  const hasVariants = variants.length > 0
  const stock = hasVariants
    ? variants.reduce(
        (total, variant) => total + (Number(variant.stock) || 0),
        0
      )
    : Number(product.stock) || 0

  const selectedStock = hasVariants
    ? Number(selectedVariant?.stock) || 0
    : stock

  const imageUrl = product.imageUrl || product.image

  const clearCartFeedback = () => {
    setCartMessage('')
    setCartError('')
  }

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
    setQuantity(1)
    clearCartFeedback()
  }

  const changeQuantity = (nextQuantity) => {
    setQuantity(nextQuantity)
    clearCartFeedback()
  }

  const handleAddToCart = async () => {
    clearCartFeedback()

    // 1. Logged-out visitors go to the login page.
    if (!localStorage.getItem('token')) {
      navigate('/auth')
      return
    }

    // 2. A variant must be chosen.
    if (!selectedVariant) {
      setCartError('Choose an option before adding this item to your cart.')
      return
    }

    // 6. Disable the button while the request runs.
    setIsAdding(true)

    try {
      // 3. The server reads exactly these three fields.
      await apiFetch('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id,
          variantId: selectedVariant._id,
          quantity,
        }),
      })

      // 4. Success.
      setCartMessage('Added to your cart. Open your cart to review it.')
    } catch (err) {
      // An expired or invalid token: ask the user to log in again.
      if (err.status === 401) {
        localStorage.removeItem('token')
        navigate('/auth')
        return
      }

      // 5. Failure: show the server's message (stock, staff account, etc.).
      setCartError(err.message || 'Could not add this item to your cart.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <main className="text-inc mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <nav className="text-muted mb-8 text-sm" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ascent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-ascent">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="border-border bg-canvas flex aspect-square max-h-155 w-full items-center justify-center overflow-hidden rounded-2xl border">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-muted flex flex-col items-center gap-4">
                <FaBoxOpen className="text-ascent/50 text-7xl" />
                <p>Product image coming soon</p>
              </div>
            )}
          </div>
        </section>

        <section className="flex min-w-0 flex-1 flex-col">
          <p className="text-ascent text-sm font-medium tracking-widest uppercase">
            {product.brand || product.category || 'MiniShop'}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-semibold">
            ${Number(product.price || 0).toFixed(2)}
          </p>

          <p
            className={`mt-4 flex items-center gap-2 text-sm font-medium ${
              selectedStock > 0 ? 'text-success' : 'text-error'
            }`}
          >
            <FaCheckCircle />
            {selectedStock > 0
              ? `${selectedStock} available for this selection`
              : 'Currently out of stock'}
          </p>

          <p className="text-muted mt-5 leading-7">
            {product.description ||
              'No description is available for this product yet.'}
          </p>

          {hasVariants && (
            <div className="mt-7">
              <h2 className="mb-3 font-semibold">Choose a variant</h2>

              <div className="flex flex-wrap gap-3">
                {variants.map((variant, index) => {
                  const isSelected = selectedVariant === variant
                  const isAvailable = Number(variant.stock) > 0

                  return (
                    <button
                      key={variant._id || index}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleVariantChange(variant)}
                      className={`rounded-lg border px-4 py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        isSelected
                          ? 'border-ascent bg-ascent/10 text-ascent'
                          : 'border-border hover:border-ascent'
                      }`}
                    >
                      {[variant.color, variant.size]
                        .filter(Boolean)
                        .join(' / ') || `Option ${index + 1}`}
                      {!isAvailable && ' — unavailable'}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="border-border flex items-center overflow-hidden rounded-lg border">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => changeQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 disabled:opacity-40"
              >
                −
              </button>

              <span className="min-w-10 text-center">{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= selectedStock}
                onClick={() =>
                  changeQuantity(Math.min(selectedStock, quantity + 1))
                }
                className="px-4 py-3 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={selectedStock < 1 || isAdding}
              onClick={handleAddToCart}
              className="bg-ascent min-w-44 flex-1 rounded-lg px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isAdding ? 'Adding...' : 'Add to cart'}
            </button>
          </div>

          {cartMessage && (
            <p
              role="status"
              className="border-success/20 bg-success/5 text-success mt-4 rounded-lg border px-4 py-3 text-sm"
            >
              {cartMessage}
            </p>
          )}

          {cartError && (
            <p
              role="alert"
              className="border-error/20 bg-error/5 text-error mt-4 rounded-lg border px-4 py-3 text-sm"
            >
              {cartError}
            </p>
          )}

          <div className="divide-border border-border mt-8 divide-y border-y">
            <div className="py-4">
              <h2 className="font-semibold">Product information</h2>
              <p className="text-muted mt-2 text-sm leading-6">
                {product.brand
                  ? `Brand: ${product.brand}`
                  : 'Brand information is not available.'}
              </p>
              <p className="text-muted mt-1 text-sm leading-6">
                {product.category
                  ? `Category: ${product.category}`
                  : 'Category information is not available.'}
              </p>
            </div>

            <div className="py-4">
              <h2 className="font-semibold">Availability</h2>
              <p className="text-muted mt-2 text-sm leading-6">
                {stock > 0
                  ? `${stock} total unit(s) across all variants.`
                  : 'This product is currently out of stock.'}
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="text-ascent mt-6 inline-flex items-center gap-2 self-start text-sm font-medium"
          >
            <FaArrowLeft /> Continue shopping
          </Link>
        </section>
      </div>
    </main>
  )
}

export default ProductDetails
