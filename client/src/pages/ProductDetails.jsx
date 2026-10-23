
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { FaArrowLeft, FaBoxOpen, FaCheckCircle } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL

const ProductDetails = () => {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const getProduct = async () => {
      setIsLoading(true)
      setError('')
      setProduct(null)
      setSelectedVariant(null)
      setQuantity(1)

      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('This product could not be found.')
          }

          throw new Error(`Could not load this product (${response.status}).`)
        }

        const result = await response.json()

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
          setError(err.message || 'Something went wrong.')
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
      <main className="mx-auto max-w-7xl px-5 py-16 text-muted sm:px-8">
        Loading product details...
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="rounded-xl border border-border p-8">
          <h1 className="text-2xl font-semibold">Product unavailable</h1>
          <p className="mt-3 text-muted">
            {error || 'We could not find this product.'}
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ascent px-4 py-3 text-white"
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

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
    setQuantity(1)
  }

  const handleAddToCart = () => {
    // Cart integration will be connected to the authenticated cart API.
    // For now, the selected product and quantity are not sent to the server.
    alert('Cart integration is not connected yet.')
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 text-inc sm:px-8">
      <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ascent">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-ascent">Products</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex aspect-square max-h-155 w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-canvas">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-muted">
                <FaBoxOpen className="text-7xl text-ascent/50" />
                <p>Product image coming soon</p>
              </div>
            )}
          </div>
        </section>

        <section className="flex min-w-0 flex-1 flex-col">
          <p className="text-sm font-medium uppercase tracking-widest text-ascent">
            {product.brand || product.category || 'MiniShop'}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-semibold">
            ${Number(product.price || 0).toFixed(2)}
          </p>

          <p className={`mt-4 flex items-center gap-2 text-sm font-medium ${
            selectedStock > 0 ? 'text-success' : 'text-error'
          }`}>
            <FaCheckCircle />
            {selectedStock > 0
              ? `${selectedStock} available for this selection`
              : 'Currently out of stock'}
          </p>

          <p className="mt-5 leading-7 text-muted">
            {product.description || 'No description is available for this product yet.'}
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
                      key={`${variant.color || ''}-${variant.size || ''}-${index}`}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleVariantChange(variant)}
                      className={`rounded-lg border px-4 py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        isSelected
                          ? 'border-ascent bg-ascent/10 text-ascent'
                          : 'border-border hover:border-ascent'
                      }`}
                    >
                      {[variant.color, variant.size].filter(Boolean).join(' / ') ||
                        `Option ${index + 1}`}
                      {!isAvailable && ' — unavailable'}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-lg border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
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
                  setQuantity((current) => Math.min(selectedStock, current + 1))
                }
                className="px-4 py-3 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={selectedStock < 1}
              onClick={handleAddToCart}
              className="min-w-44 flex-1 rounded-lg bg-ascent px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to cart
            </button>
          </div>

          <div className="mt-8 divide-y divide-border border-y border-border">
            <div className="py-4">
              <h2 className="font-semibold">Product information</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {product.brand ? `Brand: ${product.brand}` : 'Brand information is not available.'}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {product.category ? `Category: ${product.category}` : 'Category information is not available.'}
              </p>
            </div>

            <div className="py-4">
              <h2 className="font-semibold">Availability</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {stock > 0
                  ? `${stock} total unit(s) across all variants.`
                  : 'This product is currently out of stock.'}
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-ascent"
          >
            <FaArrowLeft /> Continue shopping
          </Link>
        </section>
      </div>
    </main>
  )
}

export default ProductDetails
