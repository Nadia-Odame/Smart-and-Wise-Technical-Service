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
   npm run seed
   ```
7. **Deploying?** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment
   variables on your host (Vercel/Netlify) *before* the first deploy — Vite bakes them in at
   build time. Never set `SUPABASE_SERVICE_ROLE_KEY` there.
8. **Verify the security-critical bit**: confirm the public anon key cannot read the
   `enquiries` table (only insert). Easiest check: in the SQL Editor, run a query as the
   `anon` role against `enquiries` — it should return nothing.

Once that's done, log in at `/admin` with the account from step 5.

## Two-step login verification (email code)

Every admin login requires a second step, always — not opt-in. After the password check
succeeds, that session is immediately dropped and Supabase emails a 6-digit code to the
admin's address; only entering that code on the "Enter your code" screen creates the real
session. No authenticator app needed, no extra service — this uses only Supabase's built-in
email-OTP support (`signInWithOtp`/`verifyOtp`).

**One-time manual setup required in the Supabase Dashboard:** the emailed code only shows up
as plain text if the email template actually includes it. Go to Authentication → Email
Templates → the template used for OTP/magic-link sign-in, and make sure its body includes
`{{ .Token }}` (e.g. add a line like "Your code is: {{ .Token }}"). By default the template
may only show a clickable "Log in" link/button with no visible code — skip this step and
admins won't have a code to type in. (If the template *also* keeps the link/button, clicking
it completes sign-in too — that's expected, not a bug, since it equally proves access to the
inbox.)

**Rate limits:** Supabase limits how many OTP emails it will send to the same address per
hour (a handful). If you're testing repeatedly and stop receiving codes, that's this limit,
not a bug — wait a bit and try again. The "Resend code" button on the verify screen has its
own 30-second cooldown to help avoid hitting it.

**If an admin loses access to their email address**, there is no self-service recovery —
update the email on their account from the Supabase Dashboard (Authentication → Users) or the
SQL Editor.
