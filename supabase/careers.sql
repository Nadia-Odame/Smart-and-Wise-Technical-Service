-- Run once against the already-live project, after schema.sql/rls.sql/storage.sql
-- have already been applied. Self-contained: creates its own tables, RLS, and
-- storage bucket without touching the original three files.

-- 1. Career categories — admin-manageable, full CRUD (modeled on collections,
--    not services: nothing else in the codebase hardcodes category ids).
create table public.career_categories (
  slug text primary key,
  name text not null,
  description text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 2. Job applications — public submits, admin reviews (modeled on enquiries).
create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references public.career_categories(slug) on update cascade on delete restrict,
  full_name text not null,
  email text not null,
  phone text not null,
  cover_message text,
  cv_path text not null, -- object path inside the private 'cvs' bucket, NOT a URL
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  created_at timestamptz not null default now()
);
create index job_applications_status_idx on public.job_applications(status);
create index job_applications_created_at_idx on public.job_applications(created_at desc);
create index job_applications_category_slug_idx on public.job_applications(category_slug);

-- RLS
alter table public.career_categories enable row level security;
alter table public.job_applications enable row level security;

-- career_categories: public read, admin full write (exact collections pattern)
create policy "career_categories_public_read" on public.career_categories
  for select to anon, authenticated using (true);
create policy "career_categories_admin_insert" on public.career_categories
  for insert to authenticated with check (true);
create policy "career_categories_admin_update" on public.career_categories
  for update to authenticated using (true) with check (true);
create policy "career_categories_admin_delete" on public.career_categories
  for delete to authenticated using (true);

-- job_applications: public can only insert; only an admin can read/update/delete
-- (exact enquiries pattern — no anon select policy at all, deliberately)
create policy "job_applications_public_insert" on public.job_applications
  for insert to anon, authenticated with check (true);
create policy "job_applications_admin_select" on public.job_applications
  for select to authenticated using (true);
create policy "job_applications_admin_update" on public.job_applications
  for update to authenticated using (true) with check (true);
create policy "job_applications_admin_delete" on public.job_applications
  for delete to authenticated using (true);

-- 3. Private CV bucket — unlike 'media', public: false. Anon may upload
-- (insert) a CV during application, but can never list or read one back.
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

create policy "cvs_public_insert" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'cvs');
create policy "cvs_admin_select" on storage.objects
  for select to authenticated using (bucket_id = 'cvs');
create policy "cvs_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'cvs');
-- Deliberately no "cvs_public_select" policy — that omission is what makes
-- CVs unreadable by the anon key, mirroring job_applications having no
-- anon select policy.
