# Supabase setup

These SQL files aren't run automatically — paste and run them in your Supabase project's
SQL Editor (Dashboard → SQL Editor → New query), in this order:

1. `schema.sql` — creates the tables
2. `rls.sql` — locks them down with Row Level Security
3. `storage.sql` — creates the public `media` bucket for photos

After running all three, see the repo's main `README.md` for the remaining setup steps
(env vars, creating the admin user, seeding content).

## Optional: Careers page

`careers.sql` is a separate, self-contained file for the Careers page and job
applications feature — run it once, any time after the three files above, if you want
that feature enabled. It creates its own tables (`career_categories`, `job_applications`)
and a **private** storage bucket (`cvs`) for uploaded CVs, which — unlike the public
`media` bucket — is never readable by the public anon key, only by a logged-in admin.
