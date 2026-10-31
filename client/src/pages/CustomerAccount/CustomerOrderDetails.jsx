/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { apiFetch } from "../../utils/api"

const money = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: '$',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString('en-BD', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'

const CustomerOrderDetails = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    apiFetch(`/orders/my/${orderId}`)
      .then((result) => {
        if (active) {
          setOrder(result.order || result.data?.order || null)
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load this order.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [orderId])

  if (loading) {
    return (
      <p className="text-muted p-8 text-center text-sm">
        Loading order details...
      </p>
    )
  }

  if (error || !order) {
    return (
      <div className="border-border flex flex-col gap-4 rounded-xl border p-6">
        <p role="alert" className="text-error text-sm">
          {error || 'Order not found.'}
        </p>
        <Link
          to="/account/orders"
          className="text-ascent text-sm font-medium hover:underline"
        >
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <Link
          to="/account/orders"
          className="text-ascent text-sm font-medium hover:underline"
        >
          ← Back to orders
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-muted mt-1 text-sm">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          <span className="bg-ascent/10 text-ascent inline-flex rounded-full px-3 py-1.5 text-sm font-medium capitalize">
            {order.status}
          </span>
        </div>
      </div>

      <section className="border-border rounded-xl border p-5 sm:p-6">
        <h2 className="font-semibold">Items</h2>

        <div className="divide-border mt-4 flex flex-col divide-y">
          {(order.items || []).map((item, index) => (
            <div
              key={`${item.variantId || index}-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-muted mt-1 text-sm">
                  {[item.color, item.size].filter(Boolean).join(' · ') ||
                    'Standard variant'}{' '}
                  · Qty {item.quantity}
                </p>
              </div>

              <p className="font-medium">
                {money(item.subtotal ?? item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-border flex flex-col gap-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{money(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delivery</span>
            <span>{money(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{money(order.totalAmount)}</span>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-5 sm:flex-row">
        <section className="border-border min-w-0 flex-1 rounded-xl border p-5">
          <h2 className="font-semibold">Delivery Details</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <p>{order.customerName}</p>
            <p>{order.phone}</p>
            <p className="text-muted whitespace-pre-wrap">
              {order.deliveryAddress}
            </p>
          </div>
        </section>

        <section className="border-border min-w-0 flex-1 rounded-xl border p-5">
          <h2 className="font-semibold">Payment</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <p>Method: {order.paymentMethod || 'COD'}</p>
            <p>
              Status:{' '}
              <span className="capitalize">
                {order.paymentStatus || 'pending'}
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CustomerOrderDetails
