-- Run after schema.sql. Enables Row Level Security and defines who can read/write what.
--
-- Pattern for content tables (business_settings, services, collections, products,
-- gallery_photos): anyone (anon = the public website) can READ, only a logged-in
-- admin (authenticated) can WRITE.
--
-- enquiries is the exception: the public can INSERT (submit a form) but there is
-- deliberately NO anon select policy, so the public anon key shipped in the browser
-- bundle can never read other customers' enquiries back. Only an authenticated
-- admin can view/update/delete them.

alter table public.business_settings enable row level security;
alter table public.services enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.enquiries enable row level security;

-- business_settings: public read, admin update only (it's a singleton, no insert/delete)
create policy "business_settings_public_read" on public.business_settings
  for select to anon, authenticated using (true);
create policy "business_settings_admin_update" on public.business_settings
  for update to authenticated using (true) with check (id = 1);

-- services: public read, admin full write
create policy "services_public_read" on public.services
  for select to anon, authenticated using (true);
create policy "services_admin_insert" on public.services
  for insert to authenticated with check (true);
create policy "services_admin_update" on public.services
  for update to authenticated using (true) with check (true);
create policy "services_admin_delete" on public.services
  for delete to authenticated using (true);

-- collections: public read, admin full write
create policy "collections_public_read" on public.collections
  for select to anon, authenticated using (true);
create policy "collections_admin_insert" on public.collections
  for insert to authenticated with check (true);
create policy "collections_admin_update" on public.collections
  for update to authenticated using (true) with check (true);
create policy "collections_admin_delete" on public.collections
  for delete to authenticated using (true);

-- products: public read, admin full write
create policy "products_public_read" on public.products
  for select to anon, authenticated using (true);
create policy "products_admin_insert" on public.products
  for insert to authenticated with check (true);
create policy "products_admin_update" on public.products
  for update to authenticated using (true) with check (true);
create policy "products_admin_delete" on public.products
  for delete to authenticated using (true);

-- gallery_photos: public read, admin full write
create policy "gallery_public_read" on public.gallery_photos
  for select to anon, authenticated using (true);
create policy "gallery_admin_insert" on public.gallery_photos
  for insert to authenticated with check (true);
create policy "gallery_admin_update" on public.gallery_photos
  for update to authenticated using (true) with check (true);
create policy "gallery_admin_delete" on public.gallery_photos
  for delete to authenticated using (true);

-- enquiries: public can only insert; only an admin can read, update, or delete
create policy "enquiries_public_insert" on public.enquiries
  for insert to anon, authenticated with check (true);
create policy "enquiries_admin_select" on public.enquiries
  for select to authenticated using (true);
create policy "enquiries_admin_update" on public.enquiries
  for update to authenticated using (true) with check (true);
create policy "enquiries_admin_delete" on public.enquiries
  for delete to authenticated using (true);
