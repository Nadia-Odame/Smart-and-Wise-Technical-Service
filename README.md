# Smart and Wise Technical Service

Website for Smart and Wise Technical Service, a generator servicing, repairs, electrical works, and engine overhauling company based in Owulabu, Ghana.

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (database, auth, storage) — optional; the site works without it, see below

## Getting started

Requires Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# Install dependencies
npm i

# Start the dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project structure

- `src/pages` — route-level pages (Home, Services, Shop, Gallery, About, Contact, Cart, Checkout)
- `src/pages/admin` — the password-protected admin dashboard (`/admin`)
- `src/components` — shared layout and UI components
- `src/data` — TypeScript interfaces, `formatPrice`, and the default/fallback content shown when Supabase isn't configured
- `src/lib/api` — Supabase fetch/write functions per table
- `src/hooks` — cart/wishlist state (local) and react-query hooks (live content)
- `supabase/` — SQL to set up the database (see below)

## Backend / admin dashboard setup (Supabase)

The site runs fine with no backend at all — every page falls back to built-in placeholder
content and the Contact/Checkout forms still reach the business via WhatsApp. Setting up
Supabase adds: a permanent record of every enquiry, and a `/admin` dashboard where the
business owner can edit prices, products, gallery photos, service descriptions, and business
hours himself.

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is fine).
2. **Run the SQL**, in this exact order, in Supabase's SQL Editor (Dashboard → SQL Editor →
   New query): `supabase/schema.sql`, then `supabase/rls.sql`, then `supabase/storage.sql`.
3. **Set your env vars.** Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (Supabase Dashboard → Settings → API). Also add
   `SUPABASE_SERVICE_ROLE_KEY` from the same page — it's needed only for the one-off seed
   script below, is never sent to the browser, and must never be set on your hosting platform.
4. **Disable public sign-up.** Dashboard → Authentication → Providers → Email → turn off
   "Allow new users to sign up", so nobody but the admin account below can ever log in.
5. **Create the one admin account.** Dashboard → Authentication → Users → Add user (email +
   password). This is the login for whoever manages the site — share the password with them
   directly, not through the site itself.
6. **Seed the database** so it starts out matching the current static site (uploads the
   existing placeholder photos, inserts the current services/products/business info):
   ```sh
   node --env-file=.env scripts/seed-supabase.mjs
   ```
7. **Deploying?** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment
   variables on your host (Vercel/Netlify) *before* the first deploy — Vite bakes them in at
   build time. Never set `SUPABASE_SERVICE_ROLE_KEY` there.
8. **Verify the security-critical bit**: confirm the public anon key cannot read the
   `enquiries` table (only insert). Easiest check: in the SQL Editor, run a query as the
   `anon` role against `enquiries` — it should return nothing.

Once that's done, log in at `/admin` with the account from step 5.
