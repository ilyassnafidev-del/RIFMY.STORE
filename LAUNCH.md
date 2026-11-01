# RIFMY launch configuration

The storefront runs on the Next.js App Router API through Vinext, React, TypeScript and Tailwind, deployed as a Cloudflare Worker. D1 stores products, inventory, invitations, orders and verified payment events; R2 stores approved image uploads. The public site defaults to TEST mode. Test records do not indicate payment and must not be fulfilled.

## Run
`npm ci`, `npm run db:generate` only after schema edits, `npm run build`, `npm run dev`.
Use the supplied local D1 migration commands in the starter README before testing database behavior. Sites applies committed migrations on publication.

## Runtime secrets and activation
Set runtime environment variables through Sites; never commit credentials.
- `ADMIN_USER_IDS`: comma-separated trusted ChatGPT user IDs for `/admin`. No default administrator. Obtain your stable site identity from an authenticated request or hosting administrator; do not use email as the authorization key.
- `STORE_MODE`: `test` (default) or `live`.
- `STRIPE_SECRET_KEY`: `sk_test_...` for real Stripe sandbox checkout. With no key, checkout only saves `test_pending` records and explicitly states no payment happened. A Stripe merchant account and currency support must be confirmed for the business.
- `STRIPE_WEBHOOK_SECRET`: signature secret for `/api/webhook`. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Only verified signed events with matching session, amount, currency and test/live mode can mark an order paid.
- `RESEND_API_KEY` and `BUSINESS_EMAIL`: verified sender for transactional confirmation emails. Email failures return a retriable webhook response; resend is idempotent. No messages are sent during unconfigured test checkout.
- `LAUNCH_APPROVED=true`: set only after the business has approved all policies, contact details, image usage, product specifications, payment integration and delivery coverage. Live mode also requires a live Stripe key and email credentials.

Before launch, enter actual available stock through the protected admin. Stock starts at zero because availability was not supplied. Test orders permit sample quantities. Live stock reservations use a database CHECK constraint and an atomic batch to prevent negative inventory. Pending reservations require operational reconciliation; cancellation/refund handling and expired-session stock release need to be exercised with the merchant workflow before live activation. Admin cancellation does not perform a payment refund.

Invite partners through admin using an email-bound code of at least 12 characters and an expiry date. Only the hash is stored. The server checks eligibility and applies exactly 20% to products, excluding delivery. Unknown or expired codes cannot reduce totals. Quantities, product availability and all prices are validated server-side. The published site remains owner-private unless sharing is changed explicitly.

## Assets and business facts
Business source: https://www.canva.com/design/DAHZgBFIPEU/b7oe7f7G8gx7sjvCbDnu5Q/edit
Six descriptions, 80 MAD candle price, 25 MAD delivery and 20% partner discount come from the presentation. No invented testimonials or specifications. Original emblem, product previews and craft image are extracted from authorized Canva previews. Source previews have limited resolution; replace with approved high-resolution photography before launch. The hero is AI-created editorial concept imagery, labelled in the UI. Product gallery offers the supplied image, a labelled detail crop and craft imagery; distinct additional product angles were not available.

Shipping, returns, privacy, terms and contact pages clearly mark missing business details. They are placeholders requiring approval, not complete legal policies.
