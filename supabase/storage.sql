-- Run after rls.sql. Creates one public bucket for all product/gallery/business images.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
create policy "media_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "media_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
create policy "media_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
