import { useState } from 'react'
import { useNavigate } from 'react-router'
import { jwtDecode } from 'jwt-decode'
import { IoMdClose } from 'react-icons/io'
import { FiShoppingBag } from 'react-icons/fi'
import { apiFetch } from '../../api'

const formatPrice = (amount) => `$${Number(amount || 0).toFixed(2)}`

const emptyForm = { customerName: '', phone: '', deliveryAddress: '' }

const inputClass =
  'border-border w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-ascent'

const CartButton = () => {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState('cart') 

  // Cart
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState('')
  const [busyItemId, setBusyItemId] = useState(null)

  // Checkout
  const [form, setForm] = useState(emptyForm)
  const [isPlacing, setIsPlacing] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)

  const handleExpiredSession = () => {
    localStorage.removeItem('token')
    setIsOpen(false)
    navigate('/auth')
  }

  const loadCart = async ({ silent = false } = {}) => {
    setError(null)

    if (!localStorage.getItem('token')) {
      setItems([])
      setError('Please log in to view your cart.')
      return
    }

    if (!silent) setLoading(true)

    try {
      const result = await apiFetch('/cart')
      setItems(result.cart.items)
    } catch (err) {
      if (err.status === 401) {
        handleExpiredSession()
        return
      }
      setItems([])
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    setView('cart')
    setActionError('')
    setCheckoutError('')
    loadCart()
  }

  const updateQuantity = async (item, nextQuantity) => {
    setActionError('')
    setBusyItemId(item._id)

    try {
      await apiFetch(`/cart/items/${item._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: nextQuantity }),
      })
      await loadCart({ silent: true })
    } catch (err) {
      if (err.status === 401) {
        handleExpiredSession()
        return
      }
      setActionError(err.message)
    } finally {
      setBusyItemId(null)
    }
  }

  const removeItem = async (item) => {
    setActionError('')
    setBusyItemId(item._id)

    try {
      await apiFetch(`/cart/items/${item._id}`, { method: 'DELETE' })
      await loadCart({ silent: true })
    } catch (err) {
      if (err.status === 401) {
        handleExpiredSession()
        return
      }
      setActionError(err.message)
    } finally {
      setBusyItemId(null)
    }
  }

  const startCheckout = () => {
    setCheckoutError('')

    let name = ''
    try {
      name = jwtDecode(localStorage.getItem('token')).name || ''
    } catch {
      name = ''
    }

    setForm((current) => ({
      ...current,
      customerName: current.customerName || name,
    }))
    setView('checkout')
  }

  const updateField = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
    setCheckoutError('')
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    setCheckoutError('')

    if (
      !form.customerName.trim() ||
      !form.phone.trim() ||
      !form.deliveryAddress.trim()
    ) {
      setCheckoutError('Enter your name, phone number and delivery address.')
      return
    }

    setIsPlacing(true)

    try {
      const result = await apiFetch('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone: form.phone.trim(),
          deliveryAddress: form.deliveryAddress.trim(),
        }),
      })

      setPlacedOrder(result.order)
      setItems([])
      setForm(emptyForm)
      setView('done')
    } catch (err) {
      if (err.status === 401) {
        handleExpiredSession()
        return
      }
      setCheckoutError(err.message)
    } finally {
      setIsPlacing(false)
    }
  }

  const finishShopping = () => {
    setIsOpen(false)
    setView('cart')
    navigate('/products')
  }

  const getVariant = (item) =>
    item.product?.variants?.find((v) => v._id === item.variantId)

  const availableItems = items.filter((item) => item.product)
  const hasUnavailable = items.some((item) => !item.product)
  const itemCount = availableItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = availableItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const title =
    view === 'checkout' ? 'Checkout' : view === 'done' ? 'Order placed' : 'Cart'

  return (
    <div className="overflow-hidden">
      <div
        className={`${isOpen ? 'bg-canvas' : 'bg-ascent'} border-border flex flex-1 items-end overflow-y-auto rounded-lg border p-3 transition-colors duration-300 ease-in`}
      >
        <button
          aria-label="Open cart"
          className={isOpen ? 'hidden' : 'text-white'}
          onClick={handleOpen}
        >
          <FiShoppingBag />
        </button>

        {isOpen && (
          <div className="flex h-120 w-72 flex-col sm:w-80">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <h2 className="text-xl">{title}</h2>
              <button aria-label="Close cart" onClick={() => setIsOpen(false)}>
                <IoMdClose className="text-2xl" />
              </button>
            </div>

            {/* ---------- CART VIEW ---------- */}
            {view === 'cart' && (
              <>
                <div className="mt-3 flex-1 overflow-y-auto">
                  {loading && <p className="text-sm">Loading your cart...</p>}

                  {error && (
                    <p role="alert" className="text-error text-md text-center">
                      {error}
                    </p>
                  )}

                  {actionError && (
                    <p role="alert" className="text-error mb-2 text-sm">
                      {actionError}
                    </p>
                  )}

                  {!loading && !error && items.length === 0 && (
                    <p className="text-sm">Your cart is empty.</p>
                  )}

                  {!loading &&
                    !error &&
                    items.map((item) => {
                      const isBusy = busyItemId === item._id

                      if (!item.product) {
                        return (
                          <div
                            key={item._id}
                            className="border-border flex items-center justify-between gap-2 border-b py-3 text-sm"
                          >
                            <p className="text-error">
                              This product is no longer available.
                            </p>
                            <button
                              disabled={isBusy}
                              onClick={() => removeItem(item)}
                              className="text-ascent text-xs font-medium disabled:opacity-40"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      }

                      const variant = getVariant(item)
                      const stock = Number(variant?.stock) || 0

                      return (
                        <div
                          key={item._id}
                          className="border-border border-b py-3 text-sm"
                        >
                          <div className="flex justify-between gap-2">
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-muted">
                                {[variant?.color, variant?.size]
                                  .filter(Boolean)
                                  .join(' / ')}
                              </p>
                              <p className="text-muted">
                                {formatPrice(item.product.price)} each
                              </p>
                            </div>
                            <p className="font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="border-border flex items-center overflow-hidden rounded-lg border">
                              <button
                                aria-label="Decrease quantity"
                                disabled={isBusy || item.quantity <= 1}
                                onClick={() =>
                                  updateQuantity(item, item.quantity - 1)
                                }
                                className="px-3 py-1 disabled:opacity-40"
                              >
                                -
                              </button>
                              <span className="min-w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                aria-label="Increase quantity"
                                disabled={isBusy || item.quantity >= stock}
                                onClick={() =>
                                  updateQuantity(item, item.quantity + 1)
                                }
                                className="px-3 py-1 disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>

                            <button
                              disabled={isBusy}
                              onClick={() => removeItem(item)}
                              className="text-muted hover:text-error text-xs font-medium disabled:opacity-40"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>

                {!loading && !error && items.length > 0 && (
                  <div className="border-border border-t pt-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-semibold">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <p className="text-muted mt-1 text-xs">
                      Pay with cash on delivery.
                    </p>

                    {hasUnavailable && (
                      <p className="text-error mt-2 text-xs">
                        Remove unavailable items to continue.
                      </p>
                    )}

                    <button
                      disabled={hasUnavailable || availableItems.length === 0}
                      onClick={startCheckout}
                      className="bg-ascent mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ---------- CHECKOUT VIEW ---------- */}
            {view === 'checkout' && (
              <form
                onSubmit={placeOrder}
                className="mt-3 flex flex-1 flex-col gap-3 overflow-y-auto"
              >
                <div>
                  <label htmlFor="checkout-name" className="mb-1 block text-sm">
                    Full name
                  </label>
                  <input
                    id="checkout-name"
                    name="customerName"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.customerName}
                    onChange={updateField}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="mb-1 block text-sm"
                  >
                    Phone number
                  </label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={updateField}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="mb-1 block text-sm"
                  >
                    Delivery address
                  </label>
                  <textarea
                    id="checkout-address"
                    name="deliveryAddress"
                    rows={3}
                    autoComplete="street-address"
                    required
                    value={form.deliveryAddress}
                    onChange={updateField}
                    className={inputClass}
                  />
                </div>

                <p className="text-muted text-xs">
                  {itemCount} items · {formatPrice(subtotal)} · Pay with cash on
                  delivery
                </p>

                {checkoutError && (
                  <p role="alert" className="text-error text-sm">
                    {checkoutError}
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isPlacing}
                    className="bg-ascent w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isPlacing ? 'Placing order...' : 'Place order'}
                  </button>
                  <button
                    type="button"
                    disabled={isPlacing}
                    onClick={() => {
                      setView('cart')
                      loadCart({ silent: true })
                    }}
                    className="text-muted text-sm disabled:opacity-40"
                  >
                    Back to cart
                  </button>
                </div>
              </form>
            )}

            {/* ---------- CONFIRMATION VIEW ---------- */}
            {view === 'done' && placedOrder && (
              <div className="mt-3 flex flex-1 flex-col overflow-y-auto">
                <p role="status" className="text-success text-sm font-medium">
                  Thank you. Your order has been placed.
                </p>

                <p className="mt-3 text-sm">
                  Order number{' '}
                  <span className="font-semibold">
                    #{placedOrder._id.slice(-6).toUpperCase()}
                  </span>
                </p>

                <div className="mt-3">
                  {placedOrder.items.map((item) => (
                    <div
                      key={item._id || item.variantId}
                      className="border-border flex justify-between gap-2 border-b py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-muted">
                          {[item.color, item.size].filter(Boolean).join(' / ')}{' '}
                          × {item.quantity}
                        </p>
                      </div>
                      <p>{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(placedOrder.totalAmount)}</span>
                </div>

                <p className="text-muted mt-3 text-xs leading-5">
                  Payment: cash on delivery. We will contact you on{' '}
                  {placedOrder.phone} to confirm your order. Status:{' '}
                  {placedOrder.status}.
                </p>

                <button
                  onClick={finishShopping}
                  className="bg-ascent mt-auto w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CartButton
