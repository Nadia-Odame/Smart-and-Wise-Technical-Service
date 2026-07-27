# Supabase setup

These SQL files aren't run automatically — paste and run them in your Supabase project's
SQL Editor (Dashboard → SQL Editor → New query), in this order:

1. `schema.sql` — creates the tables
2. `rls.sql` — locks them down with Row Level Security
3. `storage.sql` — creates the public `media` bucket for photos

After running all three, see the repo's main `README.md` for the remaining setup steps
(env vars, creating the admin user, seeding content).
