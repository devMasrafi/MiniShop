import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  FaArrowRight,
  FaBoxOpen,
  FaShippingFast,
  FaShieldAlt,
} from 'react-icons/fa'
import ProductCard from '../component/CardComponents/ProductCard'

const API_URL = import.meta.env.VITE_API_URL

const categories = [
  {
    name: 'T-Shirt',
    value: 't-shirt',
    description: 'Everyday tech and accessories',
  },
  { name: 'Shirt', value: 'shirt', description: 'Pieces for your daily style' },
  { name: 'Men', value: 'men', description: 'Best Mens wearables' },
  {
    name: 'Women',
    value: 'women',
    description: 'Stories and Appreal worth exploring',
  },
]

const benefits = [
  {
    icon: FaShieldAlt,
    title: 'Shopping made simple',
    description: 'Explore products in one convenient place.',
  },
  {
    icon: FaShippingFast,
    title: 'Delivery information',
    description: 'Review delivery details during checkout.',
  },
  {
    icon: FaBoxOpen,
    title: 'Product availability',
    description: 'See product stock before making a choice.',
  },
]

const Home = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const getFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products?limit=4`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Could not load products (${response.status}).`)
        }

        const result = await response.json()

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('The server returned an unexpected product response.')
        }

        setProducts(result.data.slice(0, 4))
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

    getFeaturedProducts()

    return () => controller.abort()
  }, [])

  return (
    <main className="text-inc">
      <section className="bg-canvas">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 py-16 sm:px-8 md:flex-row md:py-24">
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <span className="bg-ascent/10 text-ascent mb-4 rounded-full px-3 py-1 text-sm font-medium">
              Welcome to MiniShop
            </span>

            <h1 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              Find something you'll love.
            </h1>

            <p className="text-muted mt-5 max-w-xl text-base leading-7 sm:text-lg">
              Discover useful everyday products, explore new categories, and
              find your next favorite item.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="bg-ascent inline-flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-white transition hover:opacity-90"
              >
                Shop products <FaArrowRight />
              </Link>

              <a
                href="#featured-products"
                className="border-border hover:bg-canvas rounded-lg border bg-white px-5 py-3 font-medium transition"
              >
                Explore featured
              </a>
            </div>
          </div>

          <div className="border-border flex min-h-64 w-full flex-1 items-center justify-center rounded-2xl border bg-white p-8 md:min-h-96">
            <div className="flex max-w-sm flex-col items-center text-center">
              <div className="bg-ascent/10 flex h-24 w-24 items-center justify-center rounded-full">
                <FaBoxOpen className="text-ascent text-5xl" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold">
                A little something for everyone
              </h2>
              <p className="text-muted mt-3 leading-7">
                Browse the collection and discover what's available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-ascent text-sm font-medium tracking-widest uppercase">
              Explore
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Shop by category
            </h2>
          </div>

          <Link
            to="/products"
            className="text-ascent flex items-center gap-2 text-sm font-semibold"
          >
            All products <FaArrowRight />
          </Link>
        </div>

        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <Link
              key={category.value}
              to={`/products?category=${encodeURIComponent(category.value)}`}
              className="border-border bg-canvas hover:border-ascent hover:bg-ascent/5 flex min-h-36 min-w-0 flex-1 basis-52 flex-col justify-end rounded-xl border p-5 transition"
            >
              <span className="text-lg font-semibold">{category.name}</span>
              <span className="text-muted mt-2 text-sm leading-6">
                {category.description}
              </span>
              <span className="text-ascent mt-4 flex items-center gap-2 text-sm font-medium">
                Explore category <FaArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="featured-products"
        className="mx-auto max-w-7xl px-5 pb-14 sm:px-8"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-ascent text-sm font-medium tracking-widest uppercase">
              Picked for you
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Featured products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-ascent flex items-center gap-2 text-sm font-semibold"
          >
            Browse all <FaArrowRight />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-muted py-10">Loading products...</p>
        ) : error ? (
          <div className="border-error/30 bg-error/5 rounded-xl border p-5">
            <p className="text-error font-medium">{error}</p>
            <p className="text-muted mt-2 text-sm">
              Check that your backend server is running and try again.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="border-border rounded-xl border p-8 text-center">
            <p className="font-medium">No products available yet.</p>
            <p className="text-muted mt-2 text-sm">
              Add a product through your backend and it can appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <p className="text-muted mt-4 text-xs">
          Product availability is provided by the store.
        </p>
      </section>

      <section className="mx-auto flex max-w-7xl flex-wrap gap-4 px-5 pb-16 sm:px-8">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-canvas flex min-w-0 flex-1 basis-56 items-start gap-4 rounded-xl p-5"
          >
            <Icon className="text-ascent mt-1 shrink-0 text-xl" />
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-muted mt-2 text-sm leading-6">{description}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default Home
