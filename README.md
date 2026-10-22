# MiniShop: Project Spec (v0.1)

## 1. What it is

A single-store online shop for Bangladesh. Customers browse products, order with Cash on Delivery (COD), and track their orders. Staff manage products and process orders.

## 2. The core journey

A visitor browses products, registers or logs in, adds a product variant to their cart, checks out with delivery details, and sees the order in "my orders". Staff then confirm, process, ship and deliver it.

## 3. Entities and relations

| Entity | Belongs to | Contains | Reference or copy |
|---|---|---|---|
| **User** | nobody | name, email, hashed password, role, phone, address | n/a |
| **Product** | created by one staff user (`owner` field) | name, price, description, category, brand, variants (color, size, stock) | `owner` is a reference (audit only, not permission); variants live *inside* the product document |
| **Cart** | exactly one user | items: product ID, variant ID, quantity | **References only.** No price stored, so it always shows today's price |
| **Order** | one customer | items, delivery name/phone/address, subtotal, fee, total, payment status, order status | `user` is a reference; items and delivery details are **copies** frozen at purchase |

**Why the split:** a cart is a live intention, an order is a historical record. Changing a product's price later must never change an old order.

## 4. Roles

| Action | Visitor | Customer | Employee | Admin |
|---|---|---|---|---|
| Browse products | Yes | Yes | Yes | Yes |
| Register / log in | Yes | n/a | n/a | n/a |
| Cart and checkout | No | Yes | No | No |
| View own orders | No | Yes | No | No |
| Create / edit / archive products | No | No | Yes | Yes |
| View and process all orders | No | No | Yes | Yes |
| Change staff roles | No | No | No | Yes (not built yet) |

Rules:

- Public registration always creates a `customer`.
- Roles are checked on the server. Hiding a button in the UI is not security.

## 4b. Business rules

- Totals are calculated on the server from database prices, never from the client.
- Stock is deducted at checkout, atomically, so two buyers cannot get the last unit.
- Order status moves only forward: pending, confirmed, processing, shipped, delivered.
- Payment is COD. Payment status is tracked separately from order status.

## 5. Open decisions (to be decided by the project owner)

1. What is the delivery fee? (Currently hardcoded to 0.)
2. What happens when an order is cancelled? Is stock restored, and who may cancel?
3. Who marks a COD order as paid, and when?

## 6. MVP must-fix (from the backend review)

- [ ] Product images and a published/archived status
- [ ] Replace `getMyProducts` with a staff-wide product list
- [ ] Validate IDs and input types (products, login, register)
- [ ] Safe variant updates that keep variant IDs stable
- [ ] Bound search and pagination (escape search text, cap `limit`, reject negative `page`)
- [ ] Seed script for the first admin, an employee and sample products
- [ ] Remove leftover `owner` role code and debug `console.log`s
- [ ] Order cancellation with stock restoration, and a way to mark COD as paid
- [ ] Tests for checkout totals, stock, and order ownership and roles
- [ ] `start` script, `.env.example`, helmet, rate limiting, restricted CORS
- [ ] Cart, checkout and my-orders UI
- [ ] Deploy, then README with screenshots and a short demo video

## 7. Later (not in the MVP)

Online payment, coupons and promotions, wishlist, reviews, analytics, email/SMS, guest cart, courier integration.