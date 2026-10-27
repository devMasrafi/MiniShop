/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react'
import CreateProductModal from '../../component/ProductDashComponents/CreateProductModal'
import EditProductModal from '../../component/ProductDashComponents/EditProductModal'
import { apiFetch } from '../../utils/api'

const getProducts = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const getProduct = (response) => response?.data ?? response

const Product = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiFetch('/products')
      setProducts(getProducts(response))
    } catch (err) {
      setError(err.message || 'Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return products

    return products.filter((product) =>
      [product.name, product.category, product.brand]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    )
  }, [products, search])

  const handleCreate = async (formData) => {
    const response = await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(formData),
    })

    const createdProduct = getProduct(response)

    if (createdProduct?._id || createdProduct?.id) {
      setProducts((current) => [createdProduct, ...current])
    } else {
      await fetchProducts()
    }

    setShowCreateModal(false)
    setSuccessMessage('Product created successfully.')
    setError('')
  }

  const handleUpdate = async (productId, formData) => {
    const response = await apiFetch(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    })

    const updatedProduct = getProduct(response)

    if (updatedProduct?._id || updatedProduct?.id) {
      setProducts((current) =>
        current.map((product) =>
          String(product._id ?? product.id) === String(productId)
            ? updatedProduct
            : product
        )
      )
    } else {
      await fetchProducts()
    }

    setEditingProduct(null)
    setSuccessMessage('Product updated successfully.')
    setError('')
  }

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    )

    if (!confirmed) return

    const productId = product._id ?? product.id

    setDeletingId(productId)
    setError('')
    setSuccessMessage('')

    try {
      await apiFetch(`/products/${productId}`, {
        method: 'DELETE',
      })

      setProducts((current) =>
        current.filter(
          (item) => String(item._id ?? item.id) !== String(productId)
        )
      )

      setSuccessMessage('Product deleted successfully.')
    } catch (err) {
      setError(err.message || 'Failed to delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleModalError = (message) => {
    setError(message)
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create, update, and manage the products in your shop.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('')
            setSuccessMessage('')
            setShowCreateModal(true)
          }}
          className="bg-primary text-primary-foreground bg-ascent border-border rounded-lg border px-4 py-2 font-medium text-white hover:opacity-90"
        >
          + Add Product
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="bg-ascent/80 rounded-lg p-3 text-sm text-white"
        >
          {successMessage}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by product, category, or brand..."
          aria-label="Search products"
          className="border-border bg-background w-full rounded-lg border px-4 py-2 outline-none sm:max-w-md"
        />

        <p className="text-muted-foreground text-sm">
          {filteredProducts.length} product
          {filteredProducts.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full min-w-162 text-left text-sm">
          <thead className="bg-ascent text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-border divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-muted-foreground px-4 py-10 text-center"
                >
                  {search
                    ? 'No products match your search.'
                    : 'No products yet. Add your first product.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const productId = product._id ?? product.id
                const stock = (product.variants ?? []).reduce(
                  (total, variant) => total + Number(variant.stock || 0),
                  0
                )

                return (
                  <tr key={productId} className="hover:bg-muted/10">
                    <td className="px-4 py-4">
                      <p className="font-medium">{product.name}</p>
                      {product.brand && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {product.brand}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 capitalize">{product.category}</td>

                    <td className="px-4 py-4">
                      ${Number(product.price).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">{stock}</td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setError('')
                            setSuccessMessage('')
                            setEditingProduct(product)
                          }}
                          className="border-border hover:bg-ascent rounded-md border px-3 py-1.5 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === productId}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === productId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateProductModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          onError={handleModalError}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdate}
          onError={handleModalError}
        />
      )}
    </section>
  )
}

export default Product
