import { useEffect, useState } from "react"
import { apiFetch } from "../../utils/api"
import { Link } from "react-router"


const statuses = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const getOrders = (result) =>
  result?.orders || result?.data?.orders || []

const money = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: '$',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

const CustomerOrders = () => {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    apiFetch('/orders/my')
      .then((result) => {
        if (active) setOrders(getOrders(result))
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load your orders.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filtered =
    status === 'all'
      ? orders
      : orders.filter((order) => order.status === status)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <p className="mt-1 text-sm text-muted">
            View your purchases and check their status.
          </p>
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter orders by status"
          className="border-border bg-canvas rounded-lg border px-3 py-2.5 text-sm"
        >
          <option value="all">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error"
        >
          {error}
        </div>
      )}

      <section className="border-border overflow-hidden rounded-xl border">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted">
            Loading your orders...
          </p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <h2 className="font-semibold">
              {orders.length
                ? 'No orders match this status'
                : 'No orders yet'}
            </h2>
            <p className="text-sm text-muted">
              {orders.length
                ? 'Choose another status filter.'
                : 'Your purchases will appear here after checkout.'}
            </p>
            {!orders.length && (
              <Link
                to="/products"
                className="rounded-lg bg-ascent px-4 py-2 text-sm font-medium text-white"
              >
                Shop products
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {filtered.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(order.createdAt)} ·{' '}
                    {(order.items || []).reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0
                    )}{' '}
                    items
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Payment: {order.paymentMethod || 'COD'} ·{' '}
                    {order.paymentStatus || 'pending'}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="font-semibold">
                      {money(order.totalAmount)}
                    </p>
                    <span className="mt-1 inline-flex rounded-full bg-ascent/10 px-2.5 py-1 text-xs font-medium capitalize text-ascent">
                      {order.status}
                    </span>
                  </div>

                  <Link
                    to={`/account/orders/${order._id}`}
                    className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-ascent/10"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default CustomerOrders