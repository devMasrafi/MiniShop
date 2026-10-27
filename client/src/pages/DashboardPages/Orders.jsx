/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../../utils/api'
import SortButton from '../../component/ButtonComponents/SortButton'

const STATUS_OPTIONS = {
  pending: ['pending', 'confirmed'],
  confirmed: ['confirmed', 'processing'],
  processing: ['processing', 'shipped'],
  shipped: ['shipped', 'delivered'],
  delivered: ['delivered'],
  cancelled: ['cancelled'],
}

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-violet-100 text-violet-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

const formatMoney = (amount) =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount ?? 0)

const formatDate = (date) => {
  if (!date) return '—'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return '—'

  return parsedDate.toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getOrdersFromResponse = (result) => {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.data)) return result.data
  if (Array.isArray(result?.orders)) return result.orders
  if (Array.isArray(result?.data?.orders)) return result.data.orders

  return []
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [draftStatuses, setDraftStatuses] = useState({})
  const [savingIds, setSavingIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const result = await apiFetch('/orders')
      const fetchedOrders = getOrdersFromResponse(result)

      setOrders(fetchedOrders)

      setDraftStatuses((current) => {
        const next = {}

        fetchedOrders.forEach((order) => {
          next[order._id] = current[order._id] ?? order.status
        })

        return next
      })
    } catch (err) {
      setError(err.message || 'Could not load orders.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateDraftStatus = (orderId, status) => {
    setDraftStatuses((current) => ({
      ...current,
      [orderId]: status,
    }))

    setError('')
    setSuccessMessage('')
  }

  const saveStatus = async (order) => {
    const orderId = order._id
    const newStatus = draftStatuses[orderId]

    if (!newStatus || newStatus === order.status) return

    const allowedStatuses = STATUS_OPTIONS[order.status] || []

    if (!allowedStatuses.includes(newStatus)) {
      setError('This status transition is not allowed.')
      return
    }

    setSavingIds((current) => [...current, orderId])
    setError('')
    setSuccessMessage('')

    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })

      setOrders((current) =>
        current.map((item) =>
          item._id === orderId ? { ...item, status: newStatus } : item
        )
      )

      setSuccessMessage(
        `Order #${orderId.slice(-6).toUpperCase()} updated successfully.`
      )
    } catch (err) {
      setError(err.message || 'Could not update order status.')
      setDraftStatuses((current) => ({
        ...current,
        [orderId]: order.status,
      }))
    } finally {
      setSavingIds((current) => current.filter((id) => id !== orderId))
    }
  }

  const cancelDraft = (order) => {
    setDraftStatuses((current) => ({
      ...current,
      [order._id]: order.status,
    }))

    setError('')
    setSuccessMessage('')
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDirection(field === 'createdAt' ? 'desc' : 'asc')
    }
  }

  const filteredOrders = orders
    .filter((order) => {
      const query = search.trim().toLowerCase()

      const customerName = order.customerName || order.user?.name || ''

      const phone = order.phone || ''
      const orderId = order._id || ''

      const matchesSearch =
        !query ||
        customerName.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query) ||
        orderId.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0

      if (sortBy === 'createdAt') {
        comparison =
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      } else if (sortBy === 'totalAmount') {
        comparison = Number(a.totalAmount || 0) - Number(b.totalAmount || 0)
      } else if (sortBy === 'customer') {
        const nameA = a.customerName || a.user?.name || ''
        const nameB = b.customerName || b.user?.name || ''

        comparison = nameA.localeCompare(nameB)
      } else if (sortBy === 'status') {
        comparison = (a.status || '').localeCompare(b.status || '')
      } else if (sortBy === 'orderId') {
        comparison = (a._id || '').localeCompare(b._id || '')
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

  const pendingOrders = orders.filter(
    (order) => order.status === 'pending'
  ).length

  const deliveredOrders = orders.filter(
    (order) => order.status === 'delivered'
  ).length

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review customer orders and manage their progress.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="border-border bg-ascent transition-color hover:bg-ascent/80 rounded-lg border px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh orders'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="flex flex-wrap gap-4">
        <div className="border-border flex min-w-40 flex-1 flex-col gap-2 rounded-xl border p-5">
          <p className="text-muted-foreground text-sm">Total orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>

        <div className="border-border flex min-w-40 flex-1 flex-col gap-2 rounded-xl border p-5">
          <p className="text-muted-foreground text-sm">Pending orders</p>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>

        <div className="border-border flex min-w-40 flex-1 flex-col gap-2 rounded-xl border p-5">
          <p className="text-muted-foreground text-sm">Delivered orders</p>
          <p className="text-2xl font-bold">{deliveredOrders}</p>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {successMessage}
        </div>
      )}

      {/* Search and filter */}
      <div className="border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order ID, customer or phone..."
          aria-label="Search orders"
          className="border-border min-w-0 flex-1 rounded-lg border-b-2 bg-transparent px-3 py-2 text-sm outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter orders by status"
          className="border-border bg-ascent rounded-lg border px-3 py-2 text-sm text-white focus-visible:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders table */}
      <section className="border-border min-w-0 overflow-hidden rounded-xl border">
        <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
          <h2 className="font-semibold">All orders</h2>
          <span className="text-muted-foreground text-sm">
            Showing {filteredOrders.length} of {orders.length}
          </span>
        </div>

        {loading ? (
          <div className="text-muted-foreground p-10 text-center text-sm">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <h3 className="font-semibold">
              {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {orders.length === 0
                ? 'Customer orders will appear here after checkout.'
                : 'Try another search term or status filter.'}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-255 text-left text-sm">
              <thead className="bg-ascent text-white">
                <tr>
                  <th className="px-4 py-3">
                    <SortButton
                      field="orderId"
                      handleSort={handleSort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                    >
                      Order ID
                    </SortButton>
                  </th>

                  <th className="px-4 py-3">
                    <SortButton
                      field="customer"
                      handleSort={handleSort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                    >
                      Customer
                    </SortButton>
                  </th>

                  <th className="px-4 py-3">Phone Number</th>

                  <th className="px-4 py-3">
                    <SortButton
                      field="orderId"
                      handleSort={handleSort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                    >
                      Date
                    </SortButton>
                  </th>

                  <th className="px-4 py-3">Items</th>

                  <th className="px-4 py-3">
                    <SortButton
                      field="orderId"
                      handleSort={handleSort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                    >
                      Total
                    </SortButton>
                  </th>

                  <th className="px-4 py-3">Payment</th>

                  <th className="px-4 py-3">
                    <SortButton
                      field="orderId"
                      handleSort={handleSort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                    >
                      Status
                    </SortButton>
                  </th>

                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>

              <tbody className="divide-border divide-y">
                {filteredOrders.map((order) => {
                  const orderId = order._id
                  const currentStatus = order.status
                  const draftStatus = draftStatuses[orderId] ?? currentStatus

                  const isSaving = savingIds.includes(orderId)
                  const hasChanged = draftStatus !== currentStatus

                  const allowedStatuses = STATUS_OPTIONS[currentStatus] || [
                    currentStatus,
                  ]

                  const itemCount = (order.items || []).reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0
                  )

                  return (
                    <tr key={orderId} className="hover:bg-muted/10">
                      <td className="px-4 py-4 font-medium">
                        #{orderId?.slice(-6).toUpperCase() || '—'}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {order.customerName || order.user?.name || 'Customer'}
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs">
                          {order.user?.email || '—'}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {order.phone ? (
                          <a
                            href={`tel:${order.phone}`}
                            className="text-primary font-medium whitespace-nowrap hover:underline"
                          >
                            {order.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="text-muted-foreground px-4 py-4 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-4 py-4">{itemCount}</td>

                      <td className="px-4 py-4 font-medium whitespace-nowrap">
                        {formatMoney(order.totalAmount)}
                      </td>

                      <td className="px-4 py-4">
                        {order.paymentMethod || 'COD'}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            STATUS_STYLES[currentStatus] ||
                            'bg-muted text-foreground'
                          }`}
                        >
                          {currentStatus || 'unknown'}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex min-w-44 flex-col gap-2">
                          <select
                            value={draftStatus || ''}
                            disabled={isSaving}
                            onChange={(e) =>
                              updateDraftStatus(orderId, e.target.value)
                            }
                            aria-label={`New status for order ${orderId}`}
                            className="border-border bg-background rounded-lg border px-2 py-2 text-xs disabled:opacity-50"
                          >
                            {allowedStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={!hasChanged || isSaving}
                              onClick={() => saveStatus(order)}
                              className="hover:bg-muted rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>

                            <button
                              type="button"
                              disabled={!hasChanged || isSaving}
                              onClick={() => cancelDraft(order)}
                              className="bg-primary text-primary-foreground flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Orders
