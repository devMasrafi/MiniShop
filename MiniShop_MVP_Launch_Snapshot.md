# MiniShop — Minimum Viable Launch & Release Decision Snapshot

**Snapshot date:** 2026-10-20  
**Project:** MiniShop — single-store MERN e-commerce  
**Repository:** https://github.com/devMasrafi/MiniShop  
**Purpose:** Durable decision record for choosing the smallest responsible first public launch from `single_vendor_mern_ecommerce_checklist.txt`.

---

## 1. Executive decision

**Launch a small, real, COD-capable store. Do not try to finish the entire master checklist before release.**

The first release is ready only when a customer can discover a real product, choose a valid variant and quantity, place a COD order with server-calculated totals, receive an order reference, and later see the order; staff can process it; inventory remains consistent; and the application protects customer data and privileged operations.

A UI page alone does not count as a completed feature. Complete the relevant frontend, API, database, authorization, failure handling, and tests for each chosen workflow.

COD is acceptable as the first payment method only if the business can fulfill delivery and collect payment. Deferring online payment does not mean omitting order/payment states or reconciliation of COD collection.

## 2. Confirmed product and role decisions

### Store model

- Single-vendor / single-store e-commerce.
- Cash on Delivery first; online gateway can be added after launch.
- Product management is store-wide, not restricted to the product creator.
- A permitted staff member may manage any product.
- Build a modular monolith; avoid microservices and infrastructure complexity without a demonstrated need.

### Roles

1. **Admin** — full store control, staff role management, products, inventory, orders, and store configuration.
2. **Employee** — day-to-day product and inventory management and order processing; cannot grant roles or change sensitive administrative settings by default.
3. **Customer** — shopping, own profile, own cart, and own orders only.

Public registration must always create `customer`, regardless of a submitted role field. The first admin must be established through a controlled, private bootstrap process. Only an admin may assign or change staff roles. Prevent accidental demotion/deactivation of the final active admin. Enforce access in backend middleware/services; hiding frontend controls is not authorization.

Do not add manager, inventory-manager, marketing-manager, or other specialized roles until real operational needs justify them.

## 3. Launch scope

### P0 — mandatory before accepting real orders

#### Customer storefront

- Home page with real store identity/contact information.
- Product listing and product detail pages.
- Product images, name, description, price, variant options, and availability.
- Basic search and category filtering; bounded server-side pagination.
- Responsive layout for mobile and desktop.
- Useful loading, empty, not-found, and error states.
- No unpublished, deleted, or unavailable products shown as purchasable.

#### Authentication and account privacy

- Registration, login, logout/session handling, and authenticated current-user/profile endpoint.
- Password hashing and validation.
- Public registration cannot grant staff roles.
- Secure first-admin bootstrap.
- Role checks on every protected backend operation.
- Customer endpoints scope reads/updates to the authenticated customer; no IDOR access to another customer's profile or orders.
- Safe responses never expose password hashes, authentication secrets, or unnecessary private fields.
- A secure password-recovery process is strongly recommended before public launch; if it cannot be included immediately, define and test a safe support-assisted recovery procedure and communicate it clearly. Do not build an insecure reset shortcut.

#### Product and inventory operations

- Admin and Employee can create/update/archive/delete products according to the chosen lifecycle.
- Product/variant identifiers are stable enough for cart/order references.
- Validate price, variant, stock, and quantities on the server.
- Product images are hosted through a configured production image service or storage; local-only file paths are not a production solution.
- Prevent invalid negative stock and overselling in concurrent order attempts.
- Product edits must not rewrite historical order-item snapshots.
- Staff can see and maintain current stock. A full inventory movement ledger is useful but can be deferred if stock updates are still safe, attributable, and auditable enough for the initial operating scale.

#### Cart, checkout, order, and COD

- Cart supports adding/removing items and changing valid quantities.
- Cart identifies the exact product variant.
- Guest cart is optional. To reduce launch scope, authenticated-customer cart is sufficient if guest-cart support would delay the release; state this limitation clearly.
- Revalidate product existence, publication status, selected variant, current price, and stock on the server at checkout.
- Calculate subtotal, shipping, discount (if any), and total on the server; never trust browser-supplied totals.
- Start with a simple, documented shipping rule (for example a configured flat fee or a small set of delivery zones); don't promise unsupported real-time shipping rates.
- Create an order with a unique public order reference and immutable item snapshots (product name, variant/SKU as applicable, unit price, quantity, and line totals).
- Prevent duplicate order creation from repeated submissions.
- Use a safe atomic stock deduction/transaction strategy appropriate to the deployed MongoDB setup; handle concurrent purchases and failed order creation.
- Define order statuses and permitted transitions. At minimum: pending/placed, confirmed or processing, shipped/out for delivery where relevant, delivered, and cancelled. Keep COD payment collection status separate from fulfillment status.
- Provide order confirmation in the UI and a customer order-history/detail view.
- Staff can search/view orders needed for fulfillment and update only valid status transitions.
- Define what happens to stock on cancellation and failed delivery. Never silently restore stock twice.
- Provide a reliable way to contact the store about an order. Email/SMS integration may be deferred if a monitored manual contact channel is available.

#### Minimum security, reliability, and operations

- Validate request bodies, query parameters, and IDs; handle malformed IDs and errors consistently.
- Validate environment variables at startup; never commit secrets or production database credentials.
- Restrictive production CORS, HTTPS, security headers, rate limits for login/register/recovery, reasonable body/upload limits, and safe error responses.
- Escape or safely handle search input; enforce bounded pagination.
- No unrestricted population of user records into public product responses.
- Production database access is restricted; backup and restore/recovery steps are documented and a restore procedure is tested.
- Health check and error logging/monitoring that do not leak secrets or personal data.
- Production build and deployment smoke tests pass.
- Critical tests cover authentication/authorization, checkout totals, stock concurrency, duplicate order submission, order ownership, and staff order processing.

### P1 — minimum operational polish (simple implementation is fine)

- Product image upload/hosting and a fallback image.
- Store settings for store name, logo, contact channels, currency, timezone, delivery fee/zones, and policy links; avoid hardcoding business identity and operational rules.
- Basic product categories.
- Order status timeline or clear current status.
- Basic order confirmation email if an email provider is configured; otherwise a tested and monitored alternative must exist.
- Basic low-stock awareness, even if initially a simple admin list rather than a sophisticated alerting system.
- Accessible form labels, keyboard focus, contrast, and mobile-friendly navigation.
- A privacy notice, terms/conditions as applicable, shipping/delivery policy, cancellation/return policy, and clear contact details. Business/legal requirements must be checked for the actual business and deployment jurisdiction rather than assumed from this checklist.
- A documented manual process for delivery booking, failed deliveries, COD cash collection, and order support.
- README/operating notes for setup, deployment, environment variables, backup/restore, and known limitations.

### P2 — defer until after launch unless business-critical

- Online payment gateway and webhook processing.
- Coupons, advanced promotions, wishlist, reviews and ratings.
- Automated courier integrations and live tracking; manual carrier/tracking entry is enough initially.
- Complex returns/refunds workflow beyond a clear, lawful, workable manual process.
- Dedicated support-ticket platform and live chat.
- Advanced analytics and dashboards, custom date comparisons, CSV bulk import/export.
- Newsletter automation, marketing campaigns, recommendations, recently viewed items.
- Multiple specialized staff roles and granular per-permission UI.
- Sophisticated inventory movement reporting, reservations, advanced warehouse operations.
- Scheduled publication, bulk editing, SEO tooling beyond basic page metadata.
- Microservices, Redis, Kubernetes, and premature performance infrastructure.

**Deferral rule:** A feature can be postponed only if its absence does not make the selected customer/order workflow unsafe, misleading, unlawful, or impossible to operate. Document the limitation and the manual process.

## 4. Known backend review notes from the prior MiniShop review

These reflect the code reviewed in the previous conversation, not a fresh repository checkout on the snapshot date. Verify the current branch/files before changing code.

Existing backend structure included Express routes/controllers/services, Mongoose Product and User models, JWT authentication, and an owner-role middleware.

Important items to verify/fix before launch:

1. Replace the old `customer`/`owner` role model with `customer`/`employee`/`admin` and a reusable role-aware authorization middleware.
2. Public registration service already whitelisted name/email/password in the reviewed code, which is good; preserve this behavior and ensure submitted `role` is always ignored.
3. Establish the first admin privately; add admin-only staff/role management when needed. Guard against removing/demoting the final active admin.
4. Product routes already used authentication and owner middleware for create/update/delete in the reviewed code. Change access to admin OR employee. Do not add creator-ownership matching.
5. Product update service accepted arbitrary request-body fields in the reviewed code. Use an explicit update-field allowlist, run Mongoose validators, and prevent changes to protected fields such as creator/audit data.
6. Public product responses must not populate broad user documents. Selecting `-password` alone still exposes email, phone, address, country, and date of birth. Omit the user reference from public output or select only explicitly safe fields.
7. Product listing query parameters need bounded positive pagination, safe search handling, and consistent validation for price bounds.
8. Validate ObjectId route parameters and provide consistent 400/404 responses.
9. Ensure stock is integer/nonnegative and enforce concurrency-safe stock changes during order creation.
10. Add product image references and a production storage strategy before launch.
11. Add authenticated current-user/profile endpoint and safe projections.
12. Validate Bearer-token header format and keep authorization based on current server-side role, not only a possibly stale JWT role claim.
13. Avoid leaking internal error messages for unexpected 500 errors; add explicit not-found handling and consistent response shapes.
14. Configure restrictive CORS, security headers, rate limiting for sensitive routes, explicit request limits, and required environment-variable validation before production.
15. Ensure customer order endpoints only return the authenticated customer's own orders.
16. Add tests; do not claim checks pass until actually run.

## 5. End-to-end launch acceptance tests

Do not launch until these scenarios pass against a production-like deployment:

### Customer journey

- A visitor can browse published products and product details.
- Search/filter/pagination return correct results.
- Customer registration always results in `customer`, even if the request body contains `role: "admin"`.
- Customer can sign in and sign out.
- Customer can add a valid product variant to cart, change quantity, and remove it.
- Invalid variants, invalid quantities, unpublished/deleted products, and out-of-stock items are rejected safely.
- Client-modified prices, shipping charges, discounts, or totals do not change the server-calculated order total.
- A valid COD order creates one order and a unique order reference.
- Repeated submissions do not create duplicate orders.
- Customer can see their own order and status; they cannot access another customer's order by changing an ID.
- Customer-facing errors are understandable and do not reveal secrets.

### Staff/admin journey

- An unauthenticated request cannot manage products or orders.
- A Customer cannot access staff endpoints.
- Employee can perform permitted product/inventory and order operations but cannot grant roles or change sensitive settings.
- Admin can manage products/orders and assign staff roles.
- A demoted/deactivated staff account loses privileged access on subsequent requests.
- The last active admin cannot be accidentally demoted/deactivated.
- Invalid status jumps and unauthorized stock edits are rejected.
- Public API responses never expose password hashes or unnecessary private user fields.

### Integrity, security, and release

- Two simultaneous purchase attempts for the last available unit cannot both succeed.
- Cancellation/failure restores stock exactly when policy requires it and never twice.
- Historical order details remain correct after a product is edited or archived.
- Rate limits, CORS, HTTPS, security headers, and environment configuration are verified.
- Database backup is created and restore is tested.
- Production build succeeds; deployed health check and smoke tests pass.
- A rollback/recovery procedure and known-limitations note exist.
- All actual test results are recorded; untested features are labelled unverified.

## 6. Recommended implementation order

Keep each slice bounded and test it before starting the next.

### Phase A — backend launch blockers

1. Inspect current repo/branch and record actual state; preserve working code.
2. Complete user roles and secure initial admin setup.
3. Implement reusable authorization checks and protected staff/role-management rules.
4. Fix safe projections, request validation, pagination/search, ObjectId/error handling, update-field allowlists, and production error responses.
5. Add/update tests for registration, login, role boundaries, and product CRUD.

### Phase B — catalog

6. Finish product/variant model requirements, image references, categories as needed, publication/availability behavior.
7. Complete storefront listing and detail pages with real backend data.
8. Test mobile/responsive and empty/error states.

### Phase C — commerce

9. Implement cart and stable variant identification.
10. Define shipping fee and order status/payment status rules before implementing checkout.
11. Implement server-side checkout validation and authoritative totals.
12. Implement order creation, immutable order-item snapshots, duplicate-submission protection, and concurrency-safe stock deduction.
13. Implement customer order history/detail and staff order processing.
14. Test the complete COD purchase workflow.

### Phase D — production operations

15. Configure product image storage, domain/HTTPS, production environment variables, restrictive CORS, security headers, rate limiting, logs, and health checks.
16. Confirm store identity, real product data, contact/support channel, delivery arrangements, and applicable policies.
17. Test backup restore, deployment smoke tests, critical security scenarios, and rollback/recovery.
18. Launch to a small initial audience; monitor order failures, stock mismatches, support issues, and delivery/COD reconciliation before expanding.

## 7. Launch gates

**Gate 1 — Functional:** The complete purchase and fulfillment workflow works end to end.

**Gate 2 — Integrity:** Server totals are authoritative; duplicate orders and overselling are prevented; historical order data is stable.

**Gate 3 — Security/privacy:** Role checks, customer-data boundaries, secret handling, production configuration, and critical abuse protections pass tests.

**Gate 4 — Operational:** The business can fulfill deliveries, contact customers, handle cancellations/failed delivery, reconcile COD, and restore the database if needed.

**Gate 5 — Release:** Production build, HTTPS/domain, real content, policies/contact information, smoke tests, monitoring, rollback notes, and documented limitations are ready.

If a gate fails, do not accept real orders yet. Reduce scope or use a documented manual procedure where safe; do not fake success.

## 8. Development workflow preferences

- Explain the purpose and request/data flow before asking the user to implement unfamiliar details.
- Use small, logically grouped changes; avoid large code dumps unless explicitly requested.
- Provide practical code examples and explain the relevant lines/files when implementation is needed.
- Preserve working code and avoid unrelated refactoring.
- Test each meaningful slice before proceeding.
- Do not claim a feature or test is complete unless it was actually verified.
- Track `implemented and tested`, `implemented but not externally verified`, `blocked by configuration/credentials`, and `not implemented`.
- Ask questions only when a genuine product/business decision or credential is needed.
- Prefer understandable code and Flexbox layouts; avoid unnecessary complexity.
- Keep momentum: finish a bounded slice, test it, and move forward instead of endlessly polishing a feature.
- End each phase with: what changed, files changed, commands/tests run and results, known failures, remaining work, and decisions/configuration still needed.
- Build toward a deployable product, not merely an academic demo.

## 9. Current status / caveat

This is a **decision and planning snapshot**, not evidence that MiniShop is launch-ready. The checklist is a plan, not proof of implementation. The repository findings above came from a prior review and must be rechecked against the current `main` branch before implementation. No repository code was changed as part of creating this snapshot.

### Immediate next action

Start with a short, bounded reinspection of the current backend and frontend, then fix the backend role/security blockers and tests. After that, continue to cart → checkout → COD order creation → order processing, then deployment and launch gates.
