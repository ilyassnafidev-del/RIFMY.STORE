# Hostinger Node.js deployment

- Node.js: **24 recommended**, minimum 22.13.
- Install: `npm ci`
- Build: `npm run build`
- Start from the repository root: `npm start`
- Build artifact: `.next/standalone/server.js`
- If Hostinger asks for an output folder, use `.next/standalone`; when starting inside that folder, use `node server.js`.
- Set `HOSTNAME=0.0.0.0`; use the `PORT` supplied by Hostinger.

The build now runs native Next.js with `output: 'standalone'`, then copies `public/`, `.next/static/` and the existing SQL migrations into the standalone bundle. Keep the generated folders together. The previous Cloudflare build remains available through `npm run build:sites` (and `dev:sites`/`start:sites`).

## Runtime configuration

The storefront and order/payment logic are unchanged. On Node, the existing D1/R2 calls use a SQLite database and private upload directory, without Cloudflare Worker imports or extra npm dependencies.

Set **`RIFMY_DATA_DIR` to an absolute, private, persistent directory outside the deployment/release folder**, and back it up. It contains `rifmy.sqlite` and `uploads/`; migrations apply once at first database use. Existing Cloudflare database records/uploads are not automatically transferred to Hostinger; migrate them before switching a store with real orders. Do not put this directory under `public/` or commit it.

Keep the payment/email environment variables documented in `LAUNCH.md`; the default remains test mode. Never enable live payments without completing the existing launch requirements.

The former ChatGPT sign-in routes and trusted identity headers belong to the Sites hosting gateway, not to Next.js. Hostinger needs an authentication gateway before admin access can be enabled. It must verify the administrator, strip client-supplied identity headers, set `oai-authenticated-user-id`, and send the server-only `x-rifmy-auth-secret` matching `AUTH_PROXY_SECRET`. `ADMIN_USER_IDS` remains the allowlist. Admin requests fail closed on Node unless this gateway is configured; never expose the secret in client code. This deployment fix does not replace the existing sign-in UI.
