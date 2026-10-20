SINGLE-VENDOR MERN E-COMMERCE APPLICATION
FEATURE, ROLE & RESPONSIBILITY CHECKLIST
Version: 1.0

PURPOSE
-------
This document turns the single-vendor e-commerce master prompt into a practical
implementation checklist. Use it during UI design, MERN development, integration,
testing, and release preparation.

CORE RULE
---------
Every feature must have:
- A clear purpose and owner.
- Defined responsibilities and permissions.
- The data and APIs it depends on.
- Validation and failure handling.
- Acceptance criteria that prove it works.

A feature is not complete just because its UI exists. For example, Add to Cart
must also validate variants and quantities, persist the cart, handle stock and
price changes, and pass correct items to checkout.

HOW TO USE THIS DOCUMENT
------------------------
Mark a task complete only after it works and has been tested. Keep a separate
issue/task tracker for implementation status, blockers, and evidence from tests.
Do not treat this checklist itself as proof that code works.


1. PROJECT-WIDE COMPLETION TRACKER
==================================

PHASE 1 — FOUNDATION
[ ] Inspect repository and document architecture.
[ ] Initialize React, Express, and MongoDB connection.
[ ] Configure environment variables and secret handling.
[ ] Create shared UI components and design tokens.
[ ] Set up routing, layouts, and error handling.
[ ] Implement authentication and session management.
[ ] Implement backend role and permission checks.
[ ] Set up unit, API, and frontend testing.

PHASE 2 — STOREFRONT
[ ] Home page and configurable content.
[ ] Product listing, category pages, and product details.
[ ] Search, sorting, filtering, and pagination.
[ ] Product and variant administration.
[ ] Image upload and storage.
[ ] Customer profile and address book.
[ ] Guest and customer carts.
[ ] Wishlist.

PHASE 3 — CORE COMMERCE
[ ] Server-side cart and checkout validation.
[ ] Shipping and discount calculations.
[ ] Order creation and order-item snapshots.
[ ] Stock reservation or deduction strategy.
[ ] Cash-on-delivery workflow.
[ ] Online payment integration and verification.
[ ] Customer order history and details.
[ ] Admin order processing and cancellation.

PHASE 4 — OPERATIONS
[ ] Inventory movement history and alerts.
[ ] Shipping and tracking management.
[ ] Coupon and promotion management.
[ ] Return, refund, and cancellation workflows.
[ ] Customer and staff management.
[ ] Email and in-app notifications.
[ ] Store and policy settings.
[ ] Reviews and product moderation.

PHASE 5 — BUSINESS TOOLS
[ ] Sales and order analytics.
[ ] Inventory and refund reports.
[ ] CSV import and export.
[ ] Audit logs.
[ ] Support tickets.
[ ] SEO and accessibility.
[ ] Responsive design and performance optimization.

PHASE 6 — RELEASE
[ ] Unit and integration tests pass.
[ ] Critical end-to-end purchase flow passes.
[ ] Authorization and security checks pass.
[ ] Payment sandbox verification completed.
[ ] Production environment variables configured.
[ ] Database backup and recovery plan documented.
[ ] Deployment smoke tests pass.
[ ] Known limitations and operating instructions documented.


2. USER ROLES AND RESPONSIBILITIES
==================================

GUEST
Purpose: Discover products and prepare a cart.
Can:
[ ] Browse public pages, categories, search results, and product details.
[ ] Add products to a guest cart.
[ ] Register and sign in.
[ ] Use guest checkout if enabled by store settings.
Must not:
[ ] Access private customer data or admin tools.

CUSTOMER
Purpose: Purchase products and manage their own account.
Can:
[ ] Manage own profile and addresses.
[ ] Manage own cart and wishlist.
[ ] Place orders and view order history.
[ ] Track shipments.
[ ] Cancel eligible orders.
[ ] Request eligible returns and refunds.
[ ] Submit reviews when eligible.
[ ] Manage notification preferences.
[ ] Request account deletion.
Must not:
[ ] Access another customer's private information.
[ ] Change product inventory, payment records, or permissions.

ADMINISTRATOR
Purpose: Configure and operate the store.
Can:
[ ] Manage products, variants, categories, and inventory.
[ ] Manage orders, customers, staff, discounts, shipping, returns, and refunds.
[ ] Manage storefront content, policies, and settings.
[ ] View authorized analytics and reports.
[ ] Manage roles and permissions.
[ ] Review audit logs.
Requirements:
[ ] Protect privileged actions and log them.
[ ] Prevent accidental lockout of the last active administrator.
[ ] Do not bypass security or audit controls.

ORDER MANAGER
Purpose: Process, pack, and fulfill orders.
[ ] View authorized orders and customer delivery information.
[ ] Update only permitted order states.
[ ] Add fulfillment notes and tracking information.
[ ] Must not change payment configuration or staff permissions by default.

INVENTORY MANAGER
Purpose: Maintain accurate stock and stock movement history.
[ ] Receive stock and adjust inventory with a reason.
[ ] Review low-stock and out-of-stock reports.
[ ] Record damaged, lost, returned, or written-off stock.
[ ] Must not issue refunds or change roles by default.

CATALOG MANAGER
Purpose: Maintain the product catalog.
[ ] Manage products, variants, categories, attributes, and media.
[ ] Manage product visibility and SEO metadata.
[ ] Must not change payment records or financial settings by default.

CUSTOMER SUPPORT
Purpose: Resolve customer and order inquiries.
[ ] View only the customer/order data needed for support.
[ ] Respond to tickets and add internal notes.
[ ] Process only specifically authorized actions.
[ ] Must not issue unrestricted refunds or access unnecessary sensitive data.

MARKETING MANAGER
Purpose: Manage promotions and storefront campaigns.
[ ] Create and manage coupons and promotions.
[ ] Manage authorized homepage banners and campaigns.
[ ] Must not change inventory, payment records, or staff permissions by default.

FINANCE / REPORTS
Purpose: Reconcile payments and review financial information.
[ ] View authorized payment, refund, and sales reports.
[ ] Export approved reports.
[ ] Must not change product stock or access unrelated security secrets.

RBAC REQUIREMENTS
[ ] Enforce permissions on the backend for every protected operation.
[ ] Do not rely on hiding frontend buttons as authorization.
[ ] Use least privilege.
[ ] Log permission changes and sensitive administrative actions.
[ ] Prevent staff from granting themselves higher privileges.
[ ] Protect private customer data and credentials.


3. PUBLIC STOREFRONT PAGES
==========================

3.1 HOME PAGE — /
Purpose: Help customers discover products and start shopping.

[ ] Header: logo, navigation, search, account, wishlist, and cart.
[ ] Announcement bar controlled by the admin.
[ ] Hero banner with headline, image, and working CTA.
[ ] Featured categories with links.
[ ] Featured, newest, popular, and discounted products as configured.
[ ] Promotional banners with valid destinations.
[ ] Recently viewed products where appropriate.
[ ] Newsletter signup with consent and unsubscribe support.
[ ] Footer with contact details, policies, FAQs, and social links.
[ ] Loading, empty, error, and responsive states.
[ ] All links and buttons work.
[ ] Homepage content reflects admin changes.
[ ] Production content is not hardcoded mock data.

Dependencies: store settings, published categories and products, cart state,
authentication state, homepage content, and newsletter service.

Acceptance tests:
[ ] Every product card opens the correct product.
[ ] Search, cart, account, and category links work.
[ ] Unpublished products are not shown publicly.
[ ] Layout works on mobile, tablet, and desktop.


3.2 PRODUCT LISTING / CATEGORY — /products, /categories/:slug
Purpose: Help customers find products.

[ ] Product cards show image, title, price, sale price, and availability.
[ ] Filter by category, price, availability, brand, attributes, and rating as
    applicable.
[ ] Sort by newest, price, relevance, and popularity where supported.
[ ] Search within the catalog.
[ ] Server-side pagination or efficient load-more behavior.
[ ] Active filter chips and clear-all control.
[ ] Filters, sorting, and pagination synchronize with the URL.
[ ] Server validates query parameters.
[ ] Only published, customer-visible products are returned.
[ ] Loading, empty, no-results, and error states.
[ ] Preserve useful filters when navigating back from a product.
[ ] Use server-side filtering and pagination, not loading the entire catalog.

Acceptance test:
[ ] Filters return the correct products.
[ ] A filtered URL can be shared.
[ ] Changing pages does not unexpectedly reset unrelated filters.


3.3 PRODUCT DETAILS — /products/:slug
Purpose: Give customers enough information to make an informed purchase.

[ ] Product title, SKU where appropriate, description, and specifications.
[ ] Image gallery, image ordering, and enlarged image view.
[ ] Product variants such as size, color, or storage capacity.
[ ] Variant-specific SKU, price, image, and stock when applicable.
[ ] Quantity selector with valid minimum and maximum quantities.
[ ] Regular price, sale price, and discount presentation.
[ ] Stock availability and unavailable-variant messaging.
[ ] Add-to-cart action.
[ ] Buy-now action using the normal checkout flow.
[ ] Shipping information and return-policy summary.
[ ] Reviews, rating aggregates, and related products.
[ ] SEO title, description, and canonical URL where appropriate.
[ ] Handle archived, deleted, or unpublished products.
[ ] Revalidate stock and pricing on the server.

Dependencies: product/variant API, inventory, cart, reviews, and shipping settings.

Acceptance test:
[ ] Changing variants updates the selected option correctly.
[ ] Invalid variants and quantities are rejected by the backend even if the
    browser request is manually modified.


3.4 SEARCH — /search?q=...
[ ] Search product names, SKUs, descriptions, categories, and supported attributes.
[ ] Debounced search suggestions.
[ ] Result count and pagination.
[ ] Sort and filter controls.
[ ] Recent searches if useful.
[ ] Helpful no-results state.
[ ] Validate query length and content; apply reasonable limits.
[ ] Do not expose unpublished products or internal fields.

Acceptance test:
[ ] A valid SKU finds its product.
[ ] A search with no matches gives a useful empty state.


3.5 SIGN IN — /signin
[ ] Email or configured login identifier.
[ ] Password field and visibility toggle.
[ ] Form validation and understandable errors.
[ ] Forgot-password and registration links.
[ ] Loading state and duplicate-submit prevention.
[ ] Secure session establishment.
[ ] Safe redirect to the intended page after login.
[ ] Rate limiting and secure authentication errors.
[ ] Handle already-authenticated users correctly.


3.6 REGISTRATION — /signup
[ ] Name, email, password, and required contact information.
[ ] Password policy and confirmation if included.
[ ] Server-side validation and duplicate-account handling.
[ ] Terms/privacy acceptance where required.
[ ] Email verification if configured.
[ ] Rate limiting and abuse prevention.
[ ] Merge guest cart safely after authentication.
[ ] Never accept a customer-supplied role that grants admin access.


3.7 FORGOT / RESET PASSWORD
[ ] Generic response that does not reveal whether an account exists.
[ ] Short-lived, single-use reset token.
[ ] Secure token storage and expiration.
[ ] Validate the new password.
[ ] Invalidate relevant sessions after a password change.
[ ] Send email through a configured provider.
[ ] Rate-limit requests.
[ ] Never log reset tokens or expose them to analytics.


3.8 CART DRAWER AND FULL CART — /cart
Purpose: Maintain the proposed purchase before order placement.

[ ] Right-side drawer on desktop and suitable responsive mobile presentation.
[ ] Add, remove, and update quantities.
[ ] Display image, name, variant, SKU where useful, unit price, and line total.
[ ] Display subtotal and estimated totals.
[ ] Apply and remove valid coupons.
[ ] Display stock or availability changes.
[ ] Persist guest and authenticated carts appropriately.
[ ] Merge guest cart after login without duplication or invalid quantities.
[ ] Handle product price changes.
[ ] Revalidate price and stock on the server before checkout.
[ ] Provide empty-cart state.
[ ] Checkout CTA leads to checkout.
[ ] Do not create an order merely because an item was added to cart.
[ ] Do not trust browser-submitted prices or discounts.

Acceptance test:
[ ] Quantity changes update the displayed subtotal.
[ ] Invalid quantities are rejected by the server.
[ ] A deleted or unavailable product is handled gracefully.


4. CHECKOUT AND ORDER CREATION
==============================

4.1 CHECKOUT PAGE
[ ] Contact information.
[ ] Shipping address.
[ ] Billing address when required.
[ ] Delivery method.
[ ] Payment method.
[ ] Coupon and shipping calculations.
[ ] Order summary and final review.
[ ] Address and required-field validation.
[ ] Delivery-zone validation.
[ ] Current stock and price validation.
[ ] Clear errors and recovery from failed requests.
[ ] Guest checkout if enabled.
[ ] Prevent repeated submissions using idempotency or an equivalent mechanism.
[ ] Calculate all authoritative totals on the server.

The client must not be authoritative for product price, discount, shipping,
tax, or order total.

4.2 ORDER CREATION
[ ] Validate each product and variant against current database data.
[ ] Validate purchase limits and stock.
[ ] Calculate final amounts on the server.
[ ] Use a defined stock reservation or deduction strategy.
[ ] Use MongoDB transactions where supported and appropriate.
[ ] Prevent overselling during concurrent purchases.
[ ] Handle failed payments and expired reservations.
[ ] Restore stock when required by the cancellation/refund policy.
[ ] Record inventory movements.
[ ] Save immutable order-item snapshots: name, SKU/variant, quantity, and price.
[ ] Preserve historical order details if the product later changes or is archived.
[ ] Generate unique, non-sensitive order references.
[ ] Send confirmation only after the appropriate order event succeeds.

Acceptance test:
[ ] Repeated submissions do not create duplicate orders.
[ ] Two customers cannot buy the last unit if only one is available.
[ ] Order totals match the server-calculated breakdown.


5. CUSTOMER ACCOUNT AND DASHBOARD
=================================

5.1 CUSTOMER OVERVIEW
[ ] Welcome section.
[ ] Recent orders.
[ ] Order status summaries.
[ ] Account shortcuts.
[ ] Relevant notifications.
[ ] No hardcoded production metrics.

5.2 MY ORDERS
[ ] Order number and date.
[ ] Purchased items and quantities.
[ ] Item price snapshots and order totals.
[ ] Payment status.
[ ] Fulfillment status.
[ ] Shipping status and tracking link.
[ ] Order detail page.
[ ] Invoice/receipt where supported.
[ ] Cancellation eligibility and action.
[ ] Return/refund eligibility and action.
[ ] Pagination and useful filters where appropriate.
[ ] Customer can access only their own orders.

5.3 PROFILE AND ADDRESSES
[ ] Edit name and contact details.
[ ] Add, edit, and remove saved addresses.
[ ] Set default shipping/billing addresses.
[ ] Change password.
[ ] Manage communication preferences.
[ ] Request account deletion.
[ ] Validate all updates on the server.
[ ] Do not expose unnecessary private fields.

5.4 WISHLIST
[ ] Add/remove products.
[ ] Persist for authenticated customers.
[ ] Merge guest wishlist when appropriate.
[ ] Handle unavailable/deleted products.
[ ] Add available products to cart.
[ ] Do not allow access to another user's wishlist.

5.5 REVIEWS
[ ] Submit ratings and written reviews for eligible products.
[ ] Edit/delete reviews according to policy.
[ ] Show moderation status where appropriate.
[ ] Prevent duplicate reviews when policy disallows them.
[ ] Verify purchase eligibility on the backend.
[ ] Recalculate rating aggregates when reviews change.

5.6 CUSTOMER NOTIFICATIONS
[ ] Order confirmation.
[ ] Payment status changes.
[ ] Shipment and delivery updates where supported.
[ ] Return/refund updates.
[ ] Account security notifications.
[ ] Marketing messages only with appropriate consent.
[ ] Notification preferences and unsubscribe handling where applicable.


6. ADMIN DASHBOARD AND MANAGEMENT
=================================

6.1 ADMIN LAYOUT
[ ] Persistent sidebar and top navigation.
[ ] Search, notifications, account menu, and breadcrumbs.
[ ] Responsive sidebar and mobile navigation.
[ ] Page-level permission checks.
[ ] Loading, empty, error, and unauthorized states.
[ ] Consistent forms, tables, dialogs, and status indicators.

6.2 DASHBOARD OVERVIEW
[ ] Gross sales and net sales with defined calculation rules.
[ ] Number of orders and products sold.
[ ] Average order value.
[ ] Customer counts.
[ ] Pending/processing orders.
[ ] Low-stock and out-of-stock products.
[ ] Returns and refund totals.
[ ] Recent orders.
[ ] Best-selling products.
[ ] Sales trends and order status breakdown.
[ ] Sales by product/category where useful.
[ ] Today, last 7 days, last 30 days, this month, last month, and custom range.
[ ] Comparison period only when meaningful.
[ ] All figures calculated from actual data.
[ ] Clearly define treatment of cancellations, refunds, tax, shipping, and discounts.
[ ] Distinguish order value from collected revenue.

6.3 PRODUCT MANAGEMENT
[ ] Create, view, edit, archive, and safely delete products.
[ ] Manage names, descriptions, slugs, SKUs, prices, sale prices, and cost fields.
[ ] Manage categories and product attributes.
[ ] Upload, reorder, and remove product images.
[ ] Manage variants and variant-specific stock.
[ ] Control visibility and publication status.
[ ] Schedule publication if supported.
[ ] Mark featured products.
[ ] Manage tags and SEO metadata.
[ ] Set shipping weight/dimensions where needed.
[ ] Set stock thresholds.
[ ] Bulk edit products.
[ ] Validated CSV import/export.
[ ] Preview product before publishing.
[ ] Validate prices and stock.
[ ] Enforce SKU uniqueness where appropriate.
[ ] Preserve historical order information when archiving products.

6.4 CATEGORY MANAGEMENT
[ ] Create/edit categories.
[ ] Parent/child categories where useful.
[ ] Images, descriptions, slugs, and SEO metadata.
[ ] Reorder categories.
[ ] Control visibility.
[ ] Prevent circular parent-child relationships.
[ ] Handle products assigned to archived categories safely.

6.5 INVENTORY MANAGEMENT
[ ] Track stock by variant when applicable.
[ ] Track on-hand, reserved, and available stock if reservations are used.
[ ] Record stock adjustments and reasons.
[ ] Receive new stock.
[ ] Record damaged, lost, returned, or written-off stock.
[ ] Set low-stock thresholds.
[ ] Low-stock/out-of-stock reports.
[ ] Inventory movement history.
[ ] CSV import/export.
[ ] Prevent unauthorized and invalid negative stock.
[ ] Require a reason for manual adjustments.
[ ] Audit all stock changes.
[ ] Product edits must not silently rewrite inventory history.

6.6 ORDER MANAGEMENT
[ ] Search/filter by date, customer, payment, fulfillment, and status.
[ ] View order details and immutable item snapshots.
[ ] View addresses and totals according to permissions.
[ ] Update only allowed order states.
[ ] Confirm/reject COD orders according to workflow.
[ ] Pack and mark orders shipped.
[ ] Assign carrier and tracking number.
[ ] Record delivery and failed-delivery attempts.
[ ] Add internal notes.
[ ] Print packing slips.
[ ] Generate invoices/receipts where supported.
[ ] Cancel eligible orders.
[ ] Process return/refund requests.
[ ] Export authorized order reports.
[ ] Display order timeline and audit trail.
[ ] Prevent arbitrary status jumps.

6.7 CUSTOMER MANAGEMENT
[ ] Search and filter customers.
[ ] View permitted profile and order history.
[ ] Change account status with authorization.
[ ] Suspend/reactivate accounts.
[ ] Add access-controlled support notes.
[ ] Export customer data with appropriate permission.
[ ] Handle privacy and deletion requests.
[ ] Never expose password hashes or authentication secrets.

6.8 STAFF MANAGEMENT
[ ] Create/invite staff accounts.
[ ] Assign roles and individual permissions.
[ ] Enable/disable accounts.
[ ] Enforce least privilege.
[ ] Audit privileged actions.
[ ] Prevent staff from granting themselves higher privileges.
[ ] Protect the last active administrator.
[ ] Provide secure password recovery and account deactivation.


7. COUPONS AND PROMOTIONS
=========================

[ ] Fixed-amount discounts.
[ ] Percentage discounts.
[ ] Start/end dates.
[ ] Minimum order amount.
[ ] Maximum discount amount.
[ ] Total usage limits.
[ ] Per-customer usage limits.
[ ] Product/category restrictions.
[ ] Exclude sale products if configured.
[ ] Active/inactive status.
[ ] Automatic promotions if needed.
[ ] Usage reporting.
[ ] Define whether discounts can be combined.
[ ] Validate every rule on the server.
[ ] Prevent race conditions that exceed usage limits.
[ ] Never trust a discount value submitted by the client.


8. PAYMENTS AND FINANCIAL OPERATIONS
===================================

[ ] Provider-independent payment service interface.
[ ] Cash on delivery.
[ ] One real online gateway appropriate for the deployment market.
[ ] Payment initiation and server-side verification.
[ ] Success, failure, cancellation, and pending states.
[ ] Signed webhook verification.
[ ] Idempotent webhook processing.
[ ] Payment transaction records.
[ ] Refund initiation and status tracking.
[ ] Reconciliation-friendly references.
[ ] Authorized transaction history.
[ ] Clear customer-facing payment errors.
[ ] Never mark paid solely because the browser reaches a success URL.
[ ] Never store raw card numbers or CVV.
[ ] Use hosted checkout or tokenized payment integration.
[ ] Separate COD order confirmation from payment collection.
[ ] Link refunds to the original payment.
[ ] Enforce refundable-balance limits.
[ ] Test provider sandbox before claiming the integration works.
[ ] Document credentials, production activation, fees, and settlement configuration.

For Bangladesh-oriented deployment, evaluate SSLCOMMERZ or another currently
supported local gateway. Verify the provider's current requirements rather than
assuming credentials or live integration are available.


9. SHIPPING AND FULFILLMENT
===========================

[ ] Configurable delivery zones.
[ ] Flat-rate shipping.
[ ] Free-shipping thresholds.
[ ] Region-based charges.
[ ] Optional weight-based charges.
[ ] Delivery-method selection.
[ ] Estimated delivery range where configured.
[ ] Shipping status and shipment history.
[ ] Carrier and tracking number/URL.
[ ] Fulfillment notes.
[ ] Failed delivery and return-to-origin handling.
[ ] Delivery confirmation.
[ ] Admin-editable shipping rules.
[ ] Manual fulfillment/tracking when no carrier API exists.
[ ] Do not invent live prices or delivery estimates.


10. RETURNS, REFUNDS, AND CANCELLATIONS
=======================================

[ ] Configurable return window.
[ ] Eligible/ineligible product rules.
[ ] Customer return request and reason.
[ ] Supporting images where appropriate.
[ ] Review and decision process.
[ ] Approved, rejected, received, and other required states.
[ ] Return item quantities.
[ ] Inspection outcome.
[ ] Refund amount calculation.
[ ] Original-payment refund where supported.
[ ] Refund tracking.
[ ] Return shipment information where needed.
[ ] Inventory restocking rules.
[ ] Customer notifications.
[ ] Audit history.
[ ] Cancellation only in permitted order states.
[ ] Never refund more than the refundable balance.
[ ] Do not restock returned items before required inspection.
[ ] Keep delivery, return, payment, and refund states separate.


11. REVIEWS AND PRODUCT FEEDBACK
===============================

[ ] Product ratings.
[ ] Written reviews.
[ ] Verified-purchase badge.
[ ] Moderation and approval/rejection.
[ ] Removal of inappropriate content.
[ ] Spam prevention and rate limits.
[ ] Review reporting where useful.
[ ] Rating aggregates.
[ ] Sorting and pagination.
[ ] Backend eligibility checks.
[ ] Prevent unauthorized edits and duplicate reviews as policy requires.


12. CUSTOMER SUPPORT
====================

[ ] Contact form.
[ ] Support ticket creation.
[ ] Unique ticket reference.
[ ] Customer-visible ticket status.
[ ] Staff assignment.
[ ] Priority and category.
[ ] Internal staff notes.
[ ] Customer replies.
[ ] Resolution status.
[ ] Email notifications when configured.
[ ] Order-related support workflow.
[ ] Protect tickets and private messages from unauthorized access.

Advanced live chat, chatbot integration, and SLA automation can be deferred.


13. STOREFRONT CONTENT AND STORE SETTINGS
=========================================

[ ] Store name, logo, favicon, and contact information.
[ ] Currency, locale, and timezone.
[ ] Business address and contact channels.
[ ] Homepage banners and featured products/categories.
[ ] Announcement bar.
[ ] Footer links.
[ ] Static content pages.
[ ] SEO defaults.
[ ] Shipping and return policies.
[ ] Order numbering settings.
[ ] Tax configuration where applicable.
[ ] Coupon rules.
[ ] Stock thresholds.
[ ] Checkout options.
[ ] Payment method availability.
[ ] Notification templates.
[ ] Maintenance mode.
[ ] Do not hardcode business identity, policy text, or credentials.
[ ] For Bangladesh-oriented stores, BDT and Asia/Dhaka may be sensible defaults,
    but keep currency and timezone configurable.
[ ] Use an appropriate money representation, such as integer minor units when
    supported by the currency/provider; avoid floating-point financial arithmetic.
[ ] Keep currency explicit in monetary records.


14. NOTIFICATIONS AND EMAIL
===========================

[ ] Account verification.
[ ] Password reset.
[ ] Order confirmation.
[ ] Payment confirmation/failure.
[ ] Order cancellation.
[ ] Shipment dispatch.
[ ] Delivery updates.
[ ] Return decisions.
[ ] Refund status.
[ ] Support ticket updates.
[ ] Staff invitations.
[ ] Security events.
[ ] Reusable templates and notification service.
[ ] Use a real provider when configured.
[ ] Development email preview/test mode.
[ ] Never log reset tokens or secrets.
[ ] Trigger messages from successful business events, not merely button clicks.
[ ] Use retries for transient failures and prevent duplicate messages.


15. REPORTING AND ANALYTICS
===========================

[ ] Sales by date.
[ ] Sales by product and category.
[ ] Orders by status.
[ ] Best-selling products.
[ ] Low-stock/out-of-stock inventory.
[ ] New and returning customers.
[ ] Coupon usage.
[ ] Payment methods.
[ ] Cancellations.
[ ] Returns and refunds.
[ ] Fulfillment performance.
[ ] Useful filters and CSV export.
[ ] Clearly distinguish gross sales, net sales, collected payments, pending
    payments, refunds, and outstanding COD amounts.
[ ] Use database aggregation and pagination rather than fetching all records.


16. DATABASE DESIGN AND DATA INTEGRITY
======================================

Consider these entities; use separate collections or embedded structures according
to lifecycle, size, query, and integrity needs:

[ ] User.
[ ] Role and Permission, or equivalent permission model.
[ ] Address where a separate model is justified.
[ ] Product.
[ ] ProductVariant or embedded variants.
[ ] Category.
[ ] Cart.
[ ] Wishlist.
[ ] Order.
[ ] Payment.
[ ] Refund.
[ ] InventoryMovement.
[ ] InventoryReservation if using reservations.
[ ] Coupon.
[ ] CouponRedemption.
[ ] Shipment.
[ ] ReturnRequest.
[ ] Review.
[ ] Notification.
[ ] SupportTicket.
[ ] StoreSettings.
[ ] ContentPage.
[ ] AuditLog.

DATA RULES
[ ] Preserve order-item snapshots when products change.
[ ] Use unique indexes where uniqueness is required.
[ ] Index common searches, filters, and sorts.
[ ] Prevent duplicate payment transactions and webhook processing.
[ ] Define data ownership and deletion behavior.
[ ] Use timestamps consistently.
[ ] Enforce critical business rules in services and database constraints where
    available.
[ ] Do not expose internal document fields.
[ ] Document order, payment, inventory, and return lifecycles before implementing
    their business logic.


17. API DESIGN
===============

Use REST endpoints under /api/v1, organized by feature.

Representative public endpoints:
[ ] GET /api/v1/products
[ ] GET /api/v1/products/:slug
[ ] GET /api/v1/categories
[ ] GET /api/v1/categories/:slug
[ ] GET /api/v1/search
[ ] GET /api/v1/storefront
[ ] GET /api/v1/pages/:slug

Authentication:
[ ] POST /api/v1/auth/register
[ ] POST /api/v1/auth/login
[ ] POST /api/v1/auth/logout
[ ] GET /api/v1/auth/me
[ ] POST /api/v1/auth/forgot-password
[ ] POST /api/v1/auth/reset-password

Customer:
[ ] GET/PATCH /api/v1/me/profile
[ ] GET/POST /api/v1/me/addresses
[ ] GET /api/v1/me/orders
[ ] GET /api/v1/me/orders/:id
[ ] GET/POST /api/v1/me/wishlist
[ ] POST /api/v1/me/reviews
[ ] POST /api/v1/me/returns

Shopping:
[ ] GET /api/v1/cart
[ ] POST /api/v1/cart/items
[ ] PATCH /api/v1/cart/items/:id
[ ] DELETE /api/v1/cart/items/:id
[ ] POST /api/v1/cart/coupons
[ ] DELETE /api/v1/cart/coupons/:code
[ ] POST /api/v1/checkout/validate
[ ] POST /api/v1/orders
[ ] GET /api/v1/orders/:id/tracking

Admin examples:
[ ] GET /api/v1/admin/dashboard
[ ] GET/POST /api/v1/admin/products
[ ] PATCH /api/v1/admin/products/:id
[ ] GET /api/v1/admin/orders
[ ] PATCH /api/v1/admin/orders/:id/status
[ ] GET /api/v1/admin/customers
[ ] GET /api/v1/admin/inventory
[ ] POST /api/v1/admin/inventory/adjustments
[ ] GET /api/v1/admin/reports/sales
[ ] GET /api/v1/admin/staff
[ ] GET /api/v1/admin/settings

API REQUIREMENTS
[ ] Implement every endpoint needed by the chosen features.
[ ] Use consistent response formats and HTTP status codes.
[ ] Validate request bodies, query parameters, and route parameters.
[ ] Add pagination and reasonable query limits.
[ ] Use centralized error handling and request IDs.
[ ] Do not expose stack traces, secrets, or unnecessary customer data.
[ ] Protect admin routes and customer-specific resources.
[ ] Document APIs using OpenAPI/Swagger or an equivalent maintained document.


18. SECURITY REQUIREMENTS
=========================

[ ] Input validation and normalization.
[ ] Backend authentication and authorization.
[ ] Secure password hashing with Argon2id or properly configured bcrypt.
[ ] Secure session and cookie settings.
[ ] CSRF protection when applicable to the cookie-auth architecture.
[ ] Rate limiting for sensitive endpoints.
[ ] Restrictive production CORS configuration.
[ ] Security headers.
[ ] Protection against NoSQL injection.
[ ] XSS prevention and safe rendering.
[ ] File type, size, and content restrictions.
[ ] Safe image storage.
[ ] SSRF protection if remote URL imports are supported.
[ ] Payment webhook signature verification.
[ ] Secrets management.
[ ] Redaction of sensitive data in logs.
[ ] Audit logs for privileged actions.
[ ] Protection against IDOR and unauthorized resource access.
[ ] Secure password reset and verification.
[ ] Dependency vulnerability checks.
[ ] Disable production debug features.
[ ] Request body and upload limits.
[ ] Never trust browser-supplied roles, user IDs, prices, discounts, stock, or totals.
[ ] Never commit .env files, private keys, API tokens, or production database URLs.


19. FILE UPLOADS AND MEDIA
==========================

[ ] Use suitable object storage/image hosting for production.
[ ] Validate permitted file types and sizes.
[ ] Generate safe file identifiers.
[ ] Restrict uploads to authorized roles.
[ ] Store media references rather than large binary files in MongoDB.
[ ] Support image ordering and removal.
[ ] Clean up orphaned files safely.
[ ] Optimize images when available.
[ ] Provide fallbacks for missing images.
[ ] Do not expose filesystem paths or storage credentials.
[ ] If credentials are absent, use a documented local development adapter.
[ ] Do not claim production hosting works until configured and tested.


20. UX, ACCESSIBILITY, AND INTERACTION QUALITY
==============================================

[ ] Consistent typography, spacing, colors, and component behavior.
[ ] Responsive desktop, tablet, and mobile layouts.
[ ] Accessible labels and keyboard navigation.
[ ] Visible focus states and sufficient contrast.
[ ] Clear form errors.
[ ] Loading, success, empty, and error states.
[ ] Confirmation dialogs for destructive actions.
[ ] Toasts for non-blocking feedback.
[ ] Skeleton loaders where useful.
[ ] Useful breadcrumbs and page titles.
[ ] Searchable, filterable, paginated admin tables.
[ ] Responsive sidebar and mobile navigation.
[ ] Clear status indicators.
[ ] Confirmation before important irreversible actions.
[ ] Avoid distracting animation and excessive decoration.
[ ] Every visible interactive control must work.

INTERACTION CHECKS
[ ] Search performs real search.
[ ] Filters change results.
[ ] Pagination changes pages.
[ ] Cart controls update the cart.
[ ] Coupon controls validate coupons.
[ ] Forms validate and persist data.
[ ] Dashboard date filters update actual analytics.
[ ] Admin status controls enforce valid transitions.
[ ] Delete actions perform authorized deletion/archive.
[ ] Upload controls persist media.
[ ] Export buttons create actual files.
[ ] Notification controls work.
[ ] Logout invalidates the session.
[ ] Cancel/return actions follow backend eligibility rules.
[ ] If an integration is unavailable, show a setup-required state instead of fake success.


21. PERFORMANCE AND RELIABILITY
===============================

[ ] Paginate large datasets.
[ ] Add indexes for common queries.
[ ] Avoid N+1 query patterns.
[ ] Use projections and aggregation appropriately.
[ ] Optimize images and lazy-load where useful.
[ ] Avoid unnecessary rerenders and repeated requests.
[ ] Cache server state with correct invalidation.
[ ] Handle network failures and timeouts.
[ ] Use bounded retries for safe operations.
[ ] Do not retry non-idempotent operations without protection.
[ ] Implement graceful shutdown.
[ ] Validate required environment variables at startup.
[ ] Monitor health and database connectivity.
[ ] Use structured logs and request correlation IDs.
[ ] Provide health checks without exposing secrets.
[ ] Make seed and operational scripts repeatable.
[ ] Avoid Redis, microservices, Kubernetes, or complex infrastructure unless justified.
[ ] Start with a well-structured modular monolith.


22. TESTING REQUIREMENTS
========================

Suggested tools:
[ ] Vitest or Jest for unit tests.
[ ] Supertest for API integration tests.
[ ] React Testing Library for frontend behavior.
[ ] Playwright for critical end-to-end flows.

AUTHENTICATION TESTS
[ ] Registration and login success.
[ ] Invalid credentials.
[ ] Password reset.
[ ] Session invalidation.
[ ] Unauthorized admin access.
[ ] Permission enforcement.

PRODUCT / INVENTORY TESTS
[ ] Product creation and editing.
[ ] Invalid prices and stock.
[ ] Variant-specific pricing.
[ ] Product archival.
[ ] Concurrent purchases of the last unit.
[ ] Inventory adjustment audit trail.

CART / CHECKOUT TESTS
[ ] Guest cart.
[ ] Cart merge after login.
[ ] Invalid product/variant.
[ ] Price changes after adding to cart.
[ ] Out-of-stock products.
[ ] Invalid/expired coupons.
[ ] Repeated order submission.
[ ] Shipping calculation.
[ ] Failed checkout.

PAYMENT / ORDER TESTS
[ ] Successful and failed payment.
[ ] Duplicate webhook delivery.
[ ] Forged payment-success attempt.
[ ] COD workflow.
[ ] Cancellation.
[ ] Partial and full refunds.
[ ] Invalid order-state transitions.
[ ] Inventory restoration.

ADMIN TESTS
[ ] Role and permission restrictions.
[ ] Product CRUD.
[ ] Bulk operations.
[ ] Customer privacy.
[ ] CSV import validation.
[ ] CSV export.
[ ] Dashboard calculations.

RETURN / SUPPORT TESTS
[ ] Return eligibility.
[ ] Invalid return quantities.
[ ] Refund amount limits.
[ ] Restocking rules.
[ ] Unauthorized ticket access.

END-TO-END PURCHASE FLOW
[ ] Admin creates and publishes a product.
[ ] Customer finds the product.
[ ] Customer adds it to cart.
[ ] Customer completes a supported checkout.
[ ] Order and payment states are recorded correctly.
[ ] Admin processes and fulfills the order.
[ ] Customer sees order and tracking details.
[ ] Eligible cancellation, return, and refund flows behave correctly.

Use mocked payment responses for automated tests and the provider sandbox for
gateway verification. Never report tests as passing unless they were executed.


23. SEED DATA AND DEVELOPER EXPERIENCE
======================================

[ ] Repeatable seed script for categories and products.
[ ] Variants and image placeholders or valid sample images.
[ ] Development-only sample customers and orders.
[ ] Sample inventory movements, coupons, reviews, and store settings.
[ ] Development admin/staff creation through a documented secure process.
[ ] Use environment variables for seed credentials.
[ ] Never hardcode a production administrator password.
[ ] Prevent seed scripts from overwriting production data.
[ ] Document how to reset development data.
[ ] Document how to initialize an empty production database.


24. DEPLOYMENT AND PRODUCTION READINESS
=======================================

[ ] Production build scripts.
[ ] Frontend and backend environment configuration.
[ ] MongoDB connection and access restrictions.
[ ] HTTPS and secure cookies.
[ ] Production CORS domains.
[ ] Database backup recommendations.
[ ] Database indexes.
[ ] Health checks and error monitoring recommendations.
[ ] Image storage configuration.
[ ] Email provider configuration.
[ ] Payment gateway sandbox and production setup.
[ ] Domain and DNS guidance.
[ ] Deployment steps.
[ ] Smoke-test checklist.
[ ] Recovery and rollback guidance.
[ ] Security checklist.
[ ] Operational documentation.
[ ] README covers prerequisites, installation, environment variables, database,
    seed data, development, tests, and deployment.

Report each feature as one of:
- Implemented and tested.
- Implemented but not externally verified.
- Waiting for credentials or external configuration.
- Not yet implemented.

A successful build alone does not prove production readiness. Verify payments,
inventory consistency, security controls, backups, and critical workflows before
accepting real orders.


25. IMPLEMENTATION PHASES
=========================

PHASE 1 — FOUNDATION
[ ] Inspect the repository and preserve working code.
[ ] Confirm package manager and dependency versions.
[ ] Define architecture and folder structure.
[ ] Design models and state machines.
[ ] Configure environment validation and database connection.
[ ] Set up routing, shared UI, error handling, and tests.
[ ] Implement authentication and RBAC.

PHASE 2 — STOREFRONT
[ ] Homepage.
[ ] Product listing/details and categories.
[ ] Search and filters.
[ ] Product administration and image uploads.
[ ] Customer profile.
[ ] Cart and wishlist.

PHASE 3 — CORE COMMERCE
[ ] Checkout and server-side price/stock validation.
[ ] Order creation and item snapshots.
[ ] COD.
[ ] One online gateway.
[ ] Payment verification.
[ ] Inventory management.
[ ] Customer order history.
[ ] Admin order processing.

PHASE 4 — OPERATIONS
[ ] Shipping and tracking.
[ ] Coupons.
[ ] Returns/refunds/cancellations.
[ ] Customer and staff management.
[ ] Notifications.
[ ] Reviews.
[ ] Store settings and policies.

PHASE 5 — REPORTING AND POLISH
[ ] Analytics.
[ ] CSV import/export.
[ ] Audit logs.
[ ] Support tickets.
[ ] SEO and accessibility.
[ ] Performance and responsive refinements.

PHASE 6 — RELEASE
[ ] Automated test suite.
[ ] Security checks.
[ ] Critical end-to-end tests.
[ ] Production build.
[ ] Environment verification.
[ ] Deployment documentation.
[ ] Release checklist.


26. DEVELOPMENT WORKFLOW
========================

BEFORE CODING
[ ] Inspect existing files and scripts.
[ ] Identify the current framework, packages, and structure.
[ ] Identify working functionality to preserve.
[ ] Check dependency versions and package manager.
[ ] Identify missing requirements and external credentials.
[ ] Create a project plan and checklist.
[ ] Design database schema and state machines.
[ ] Identify high-risk checkout, payment, inventory, authorization, and refund flows.
[ ] Propose a sensible implementation sequence.

DURING DEVELOPMENT
[ ] Work in small, logically grouped steps.
[ ] Implement complete features across UI, API, and database.
[ ] Run relevant tests after each major feature.
[ ] Fix failures before building dependent features.
[ ] Update documentation.
[ ] Keep secrets safe.
[ ] Track completed, pending, blocked, and unverified work.
[ ] Explain important architectural decisions briefly.
[ ] Prefer understandable code over clever abstractions.
[ ] Ask questions only when a real decision or credential is required.
[ ] Do not replace business logic with static mock data.
[ ] Do not swallow errors or claim partial work is complete.
[ ] Do not weaken validation or delete tests to hide failures.
[ ] Avoid unnecessary dependencies and unrelated refactoring.
[ ] For unavailable integrations, document what remains and provide a safe test mode.

AT THE END OF EACH PHASE, REPORT
[ ] What was implemented.
[ ] Important files created or changed.
[ ] Tests and commands actually run.
[ ] Results and known failures.
[ ] Remaining work.
[ ] Required configuration or user decisions.


27. DEFINITION OF DONE
======================

A FEATURE IS COMPLETE ONLY WHEN:
[ ] Its UI exists and is usable.
[ ] Its backend endpoint exists where required.
[ ] Input validation works.
[ ] Authorization is enforced.
[ ] Database changes persist correctly.
[ ] Loading, success, empty, and failure states are handled.
[ ] Related workflows remain consistent.
[ ] Relevant automated tests pass.
[ ] Documentation is updated where necessary.

THE MVP IS READY ONLY WHEN:
[ ] Customers can browse and purchase products.
[ ] Checkout uses authoritative server-side pricing.
[ ] At least one supported payment method works; COD is acceptable for the
    initial release if the business supports it.
[ ] Orders and inventory remain consistent.
[ ] Admins can manage products, orders, and inventory.
[ ] Customers can view their orders.
[ ] Authentication and authorization are enforced.
[ ] Important errors and failure states are handled.
[ ] Critical tests pass.
[ ] The application builds and runs using documented instructions.
[ ] Remaining limitations are explicitly documented.

FINAL PRINCIPLE
---------------
Prioritize correctness, security, usability, and working business workflows over
the number of features or the amount of generated code. Build a maintainable,
secure, responsive single-vendor e-commerce application that a real business can
configure, operate, test, and deploy.
