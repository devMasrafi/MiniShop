import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { apiFetch } from '../../utils/api'

const getOrders = (result) => result?.orders || result?.data?.orders || []

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

const money = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: '$',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700'
    case 'cancelled':
      return 'bg-red-50 text-red-700'
    case 'shipped':
      return 'bg-blue-50 text-blue-700'
    default:
      return 'bg-amber-50 text-amber-700'
  }
}

const AccountOverview = () => {
  const [orders, setOrders] = useState([])
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

  const activeOrders = orders.filter(
    (order) => !['delivered', 'cancelled'].includes(order.status)
  )

  const delivered = orders.filter(
    (order) => order.status === 'delivered'
  ).length

  const latest = orders.slice(0, 4)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-4">
      {/* Welcome section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-ascent text-sm font-semibold">CUSTOMER ACCOUNT</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back!
          </h1>
          <p className="text-muted mt-2 text-sm">
            Keep track of your purchases and manage your account.
          </p>
        </div>

        <Link
          to="/products"
          className="bg-ascent rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Browse Products
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="border-error/30 bg-error/10 text-error rounded-xl border p-4 text-sm"
        >
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="flex flex-wrap gap-4">
        {[
          {
            label: 'Total Orders',
            value: orders.length,
            description: 'All purchases',
            icon: '▤',
          },
          {
            label: 'In Progress',
            value: activeOrders.length,
            description: 'Orders on the way',
            icon: '◷',
          },
          {
            label: 'Delivered',
            value: delivered,
            description: 'Successfully received',
            icon: '✓',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="border-border flex min-w-45 flex-1 items-start justify-between gap-4 rounded-2xl border bg-white p-5 sm:p-6"
          >
            <div>
              <p className="text-muted text-sm">{item.label}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight">
                {loading ? '—' : item.value}
              </p>
              <p className="text-muted mt-1 text-xs">{item.description}</p>
            </div>

            <span className="bg-ascent/10 text-ascent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold">
              {item.icon}
            </span>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <section className="border-border overflow-hidden rounded-2xl border bg-white">
        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold">Recent Orders</h2>
            <p className="text-muted mt-1 text-sm">
              A quick look at your latest purchases.
            </p>
          </div>

          <Link
            to="/account/orders"
            className="text-ascent text-sm font-semibold hover:underline"
          >
            View all orders →
          </Link>
        </div>

        {loading ? (
          <p className="text-muted p-6 text-sm">Loading your orders...</p>
        ) : latest.length === 0 ? (
          <div className="flex flex-col items-start gap-3 p-6 sm:p-8">
            <div className="bg-ascent/10 text-ascent flex h-12 w-12 items-center justify-center rounded-xl text-xl">
              ▤
            </div>
            <div>
              <p className="font-semibold">No orders yet</p>
              <p className="text-muted mt-1 text-sm">
                Your purchases will appear here after you place an order.
              </p>
            </div>
            <Link
              to="/products"
              className="bg-ascent mt-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="divide-border flex flex-col divide-y">
            {latest.map((order) => {
              const itemCount = (order.items || []).reduce(
                (sum, item) => sum + Number(item.quantity || 0),
                0
              )

              return (
                <Link
                  key={order._id}
                  to={`/account/orders/${order._id}`}
                  className="hover:bg-ascent/3 flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-muted mt-1 text-sm">
                      {formatDate(order.createdAt)} · {itemCount}{' '}
                      {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="font-semibold">
                        {money(order.totalAmount)}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </div>
                    <span className="text-muted hidden text-lg sm:inline">
                      →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/account/orders"
          className="border-border hover:border-ascent hover:text-ascent rounded-xl border bg-white px-4 py-3 text-sm font-medium transition"
        >
          View order history
        </Link>
        <Link
          to="/account/settings"
          className="border-border hover:border-ascent hover:text-ascent rounded-xl border bg-white px-4 py-3 text-sm font-medium transition"
        >
          Manage profile
        </Link>
      </div>
    </div>
  )
}

export default AccountOverview
