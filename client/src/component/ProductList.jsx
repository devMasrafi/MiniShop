import { useEffect, useState } from 'react'
// import { useNavigate } from "react-router";
import ProductCard from './ProductCard'
import { FaSearch } from 'react-icons/fa'

const ProductList = () => {
  const categoryData = [
    {
      id: 1,
      name: 'Electronics',
      value: 'electronics',
    },
    {
      id: 2,
      name: 'Fasion Appreal',
      value: 'Fasion',
    },
    {
      id: 3,
      name: 'Furniture',
      value: 'furniture',
    },
    {
      id: 4,
      name: 'Book and Comics',
      value: 'books',
    },
  ]

  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const handleSearch = (e) => {
    // console.log(e.target.value)
    setSearch(e.target.value)
  }

  const handleSearchClick = () => {
    getProduct(search, category)
  }
  // const navigate = useNavigate();

  const handleCategory = (e) => {
    setCategory(e.target.value)
    // console.log(e.target.value)
    getProduct(search, e.target.value)
  }

  const getProduct = async (searchValue, category) => {
    try {
      const params = new URLSearchParams()

      if (searchValue) {
        params.set('search', searchValue)
      }
      if (category) {
        params.set('category', category)
      }

      console.log(params)

      let url = `http://localhost:5000/products?${params.toString()}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to Load products. Status: ${response.status}`)
      }

      const result = await response.json()

      setProducts(result)
    } catch (error) {
      console.log('Caught Error: ', error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProduct('')
  }, [])

  return (
    <section>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl underline">MiniShop Products</h1>

        <div>
          {/* tool box */}
          <div className="sticky top-2 w-full">
            <div className="my-5 flex justify-end gap-2">
              <div className="items flex rounded-md bg-white">
                {/* Search Tool */}
                <input
                  type="text"
                  className="text-md rounded-l-md border px-3 py-2"
                  placeholder="Enter Product Name"
                  value={search}
                  onChange={handleSearch}
                />

                <button
                  className="text-md rounded-r-md border-y border-r px-3 py-3"
                  onClick={handleSearchClick}
                >
                  <FaSearch />
                </button>
              </div>

              <button className="rounded-sm bg-gray-600 px-16 py-1 capitalize">
                search
              </button>

              <button className="rounded-sm bg-gray-600 px-16 py-1 capitalize">
                search
              </button>
            </div>
          </div>

          <div className="flex gap-5">
            {/* filter */}
            <div className="sticky top-2 flex w-50 flex-col gap-3 self-start">
              <h1 className="text-2xl font-semibold">Filter: </h1>

              <div className="rounded-md bg-gray-600/20 p-5">
                <h1 className="text-md my-3 tracking-wider capitalize">
                  Category Selection
                </h1>
                <div>
                  {categoryData.map((item) => {
                    return (
                      <div key={item.id}>
                        <label className="flex items-center gap-2 tracking-wide capitalize">
                          <input
                            type="radio"
                            name="category"
                            value={item.value}
                            checked={category === item.value}
                            onChange={handleCategory}
                          />
                          {item.name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-md bg-gray-600/20 p-5">
                Price Selection
              </div>

              <div className="rounded-md bg-gray-600/20 p-5">
                Auto Select price range
              </div>
            </div>

            {/* products */}
            <div className="min-w-0 flex-1">
              <div className="my-5 flex w-full items-center justify-between gap-4">
                <p>Products grid update with search and filter</p>

                <h2 className="shrink-0 text-right">
                  {products.length !== 0
                    ? isLoading
                      ? 'Loading'
                      : error
                        ? '0'
                        : `${products.pagination.totalProducts} `
                    : 'Loading...'}{' '}
                  products
                </h2>
              </div>

              <div className="flex flex-wrap gap-4">
                {isLoading ? (
                  'Loading Plesase Wait...'
                ) : error ? (
                  <div>
                    <p>{error.message}</p>
                  </div>
                ) : (
                  products.data.map((item) => {
                    return (
                      <ProductCard
                        className={``}
                        key={item._id}
                        product={item}
                      />
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductList
