import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa'
import ProductCard from '../component/CardComponents/ProductCard'

const API_URL = import.meta.env.VITE_API_URL

const categoryData = [
  { name: 'T-Shirt', value: 't-shirt' },
  { name: 'Shirt', value: 'shirt' },
  { name: 'Women', value: 'women' },
  { name: 'Men', value: 'men' },
  { name: 'Jacket', value: 'jacket' },
]

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalProducts: 0,
    totalPages: 1,
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const getProducts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const params = new URLSearchParams()

        if (search.trim()) params.set('search', search.trim())
        if (category) params.set('category', category)
        if (minPrice !== '') params.set('minPrice', minPrice)
        if (maxPrice !== '') params.set('maxPrice', maxPrice)
        if (sort) params.set('sort', sort)

        params.set('page', String(page))
        params.set('limit', '9')

        const response = await fetch(
          `${API_URL}/products?${params.toString()}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error(`Could not load products (${response.status}).`)
        }

        const result = await response.json()

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('The server returned an unexpected response.')
        }

        setProducts(result.data)
        setPagination({
          page: result.pagination?.page ?? page,
          limit: result.pagination?.limit ?? 9,
          totalProducts: result.pagination?.totalProducts ?? result.data.length,
          totalPages: result.pagination?.totalPages ?? 1,
        })

        setSearchParams(
          (previous) => {
            const next = new URLSearchParams(previous)

            for (const key of [
              'search',
              'category',
              'minPrice',
              'maxPrice',
              'sort',
              'page',
            ]) {
              next.delete(key)
            }

            if (search.trim()) next.set('search', search.trim())
            if (category) next.set('category', category)
            if (minPrice !== '') next.set('minPrice', minPrice)
            if (maxPrice !== '') next.set('maxPrice', maxPrice)
            if (sort) next.set('sort', sort)

            next.set('page', String(page))
            return next
          },
          { replace: true }
        )
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

    getProducts()

    return () => controller.abort()
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    retryCount,
    setSearchParams,
  ])

  const applyFilters = (event) => {
    event.preventDefault()

    if (
      minPrice !== '' &&
      maxPrice !== '' &&
      Number(minPrice) > Number(maxPrice)
    ) {
      setError('Minimum price cannot be greater than maximum price.')
      return
    }

    setPage(1)
    setIsMobileFiltersOpen(false)
  }

  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSort('')
    setPage(1)
    setIsMobileFiltersOpen(false)
  }

  const changePage = (nextPage) => {
    setPage(Math.max(1, Math.min(nextPage, pagination.totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="text-inc mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <nav className="text-muted mb-6 text-sm" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ascent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>Products</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-ascent text-sm font-medium tracking-widest uppercase">
            The collection
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore products
          </h1>
          <p className="text-muted mt-2 text-sm">
            Find something useful for your everyday life.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          aria-expanded={isMobileFiltersOpen}
          aria-controls="product-filters"
          className="border-border flex items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm md:hidden"
        >
          <FaSlidersH />
          Filters
        </button>

        <label className="flex items-center gap-3 text-sm">
          <span className="text-muted">Sort by</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value)
              setPage(1)
            }}
            className="border-border focus:border-ascent rounded-lg border bg-white px-3 py-3 outline-none"
          >
            <option value="">Default order</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {category && (
          <button
            type="button"
            onClick={() => {
              setCategory('')
              setPage(1)
            }}
            className="bg-ascent/10 text-ascent rounded-full px-4 py-2 text-sm"
          >
            Category:{' '}
            {categoryData.find((item) => item.value === category)?.name ||
              category}
            <FaTimes className="ml-2 inline" />
          </button>
        )}

        {(minPrice !== '' || maxPrice !== '') && (
          <button
            type="button"
            onClick={() => {
              setMinPrice('')
              setMaxPrice('')
              setPage(1)
            }}
            className="bg-ascent/10 text-ascent rounded-full px-4 py-2 text-sm"
          >
            Price range <FaTimes className="ml-2 inline" />
          </button>
        )}

        {(category || minPrice !== '' || maxPrice !== '' || search || sort) && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-muted hover:text-ascent px-2 py-2 text-sm font-medium underline underline-offset-4"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        {/* Mobile backdrop */}
        {isMobileFiltersOpen && (
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />
        )}

        {/* Filter sidebar: modal on mobile, persistent sidebar on desktop */}
        <aside
          id="product-filters"
          aria-label="Product filters"
          className={`border-border w-full shrink-0 border bg-white p-5 ${
            isMobileFiltersOpen
              ? 'fixed inset-y-0 left-0 z-50 w-[min(88vw,22rem)] overflow-y-auto rounded-none shadow-xl'
              : 'hidden'
          } rounded-xl md:sticky md:top-20 md:block md:w-64`}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <FaSlidersH className="text-ascent" />
              Filters
            </h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="text-muted hover:text-ascent text-sm"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="text-muted hover:text-ascent p-2 md:hidden"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <form onSubmit={applyFilters} className="flex flex-col gap-6">
            {/* Search */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-search" className="text-sm font-medium">
                Search products
              </label>
              <div className="border-border focus-within:border-ascent flex items-center gap-2 rounded-lg border px-3">
                <FaSearch className="text-muted shrink-0" />
                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search..."
                  className="w-full min-w-0 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-medium">Category</legend>

              {categoryData.map((item) => (
                <label
                  key={item.value}
                  className="text-muted flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="radio"
                    name="category"
                    value={item.value}
                    checked={category === item.value}
                    onChange={(event) => {
                      setCategory(event.target.value)
                      setPage(1)
                    }}
                    className="accent-ascent"
                  />
                  <span>{item.name}</span>
                </label>
              ))}

              <label className="text-muted flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={category === ''}
                  onChange={() => {
                    setCategory('')
                    setPage(1)
                  }}
                  className="accent-ascent"
                />
                <span>All categories</span>
              </label>
            </fieldset>

            {/* Price range */}
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-medium">Price range</legend>

              <div className="flex items-center gap-3">
                <label className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-muted text-xs">Minimum</span>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => {
                      setMinPrice(event.target.value)
                      setPage(1)
                    }}
                    placeholder="0"
                    className="border-border focus:border-ascent w-full rounded-lg border px-3 py-3 text-sm outline-none"
                  />
                </label>

                <label className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-muted text-xs">Maximum</span>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => {
                      setMaxPrice(event.target.value)
                      setPage(1)
                    }}
                    placeholder="Any"
                    className="border-border focus:border-ascent w-full rounded-lg border px-3 py-3 text-sm outline-none"
                  />
                </label>
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="text-error text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="bg-ascent hover:bg-ascent/90 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
            >
              Apply filters
            </button>
          </form>
        </aside>

        {/* Products */}
        <section className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted text-sm">
              {isLoading
                ? 'Loading products...'
                : `${pagination.totalProducts} product${pagination.totalProducts === 1 ? '' : 's'} found`}
            </p>

            {pagination.totalPages > 1 && (
              <p className="text-muted text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            )}
          </div>

          {error ? (
            <div className="border-error/30 bg-error/5 rounded-xl border p-5">
              <p className="text-error font-medium">{error}</p>
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="text-ascent mt-3 text-sm font-medium underline"
              >
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-muted py-16 text-center">
              Loading your products...
            </div>
          ) : products.length === 0 ? (
            <div className="border-border rounded-xl border px-5 py-16 text-center">
              <h2 className="text-lg font-semibold">No products found</h2>
              <p className="text-muted mt-2 text-sm">
                Try a different search or clear some filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-ascent mt-5 rounded-lg px-4 py-3 text-sm font-medium text-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && !error && pagination.totalPages > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Product pages"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
                className="border-border rounded-lg border px-4 py-3 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  aria-current={page === pageNumber ? 'page' : undefined}
                  onClick={() => changePage(pageNumber)}
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    page === pageNumber
                      ? 'border-ascent bg-ascent text-white'
                      : 'border-border hover:border-ascent bg-white'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => changePage(page + 1)}
                className="border-border rounded-lg border px-4 py-3 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  )
}

export default Products
