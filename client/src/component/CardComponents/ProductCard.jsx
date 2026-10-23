
import { useNavigate } from 'react-router'
import { FaBoxOpen, FaArrowRight } from 'react-icons/fa'

const ProductCard = ({ product, className = '' }) => {
  const navigate = useNavigate()

  const imageUrl = product.imageUrl || product.image
  const stock = Array.isArray(product.variants)
    ? product.variants.reduce(
        (total, variant) => total + (Number(variant.stock) || 0),
        0
      )
    : Number(product.stock) || 0

  const openProduct = () => {
    navigate(`/products/${product._id}`)
  }

  return (
    <article
      className={`group flex min-w-0 flex-1 basis-56 flex-col overflow-hidden rounded-xl border border-border bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <button
        type="button"
        onClick={openProduct}
        className="flex aspect-square w-full items-center justify-center overflow-hidden bg-canvas text-muted"
        aria-label={`View ${product.name}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-canvas">
            <FaBoxOpen className="text-4xl text-ascent/50" />
            <span className="text-sm">Product image coming soon</span>
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs uppercase tracking-wider text-muted">
            {product.brand || product.category || 'MiniShop'}
          </p>

          <h2 className="truncate font-semibold text-inc">
            {product.name}
          </h2>

          <p className="mt-2 text-xl font-semibold text-inc">
            ${Number(product.price || 0).toFixed(2)}
          </p>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {product.description || 'Discover more about this product.'}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span
            className={`text-xs font-medium ${
              stock > 0 ? 'text-success' : 'text-error'
            }`}
          >
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </span>

          <button
            type="button"
            onClick={openProduct}
            className="flex items-center gap-2 rounded-lg bg-ascent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            View
            <FaArrowRight />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
