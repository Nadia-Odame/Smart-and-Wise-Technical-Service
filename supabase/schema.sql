-- Run this first in the Supabase SQL Editor, then rls.sql, then storage.sql.
create extension if not exists pgcrypto;

-- 1. Singleton business settings row (id is always 1)
create table public.business_settings (
  id smallint primary key default 1,
  name text not null,
  short_name text not null,
  tagline text not null,
  phone text not null,
  phone_href text not null,
  whatsapp text not null,
  address text not null,
  hours text not null,
  map_query text not null,
  updated_at timestamptz not null default now(),
  constraint business_settings_singleton check (id = 1)
);

-- 2. Services
create table public.services (
  id text primary key,
  name text not null,
  short text not null,
  description text not null,
  points text[] not null default '{}',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 3. Collections
create table public.collections (
  slug text primary key,
  name text not null,
  description text not null,
  image_url text,
  hero_image_url text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 4. Products
create table public.products (
  id text primary key,
  slug text not null unique,
  collection_slug text not null references public.collections(slug) on update cascade on delete restrict,
  name text not null,
  price numeric(10, 2) not null,
  price_unit text,
  description text not null,
  long_description text not null,
  materials text not null,
  dimensions text,
  images text[] not null default '{}',
  featured boolean not null default false,
  is_new boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_collection_slug_idx on public.products(collection_slug);

-- 5. Gallery photos
create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. Enquiries — both the Contact "quote" form and the Checkout "order" form land here
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('quote', 'order')),
  name text not null,
  phone text not null,
  service text,
  message text,
  location text,
  notes text,
  items jsonb,
  total numeric(10, 2),
  status text not null default 'new' check (status in ('new', 'contacted', 'done', 'archived')),
  created_at timestamptz not null default now()
);
create index enquiries_status_idx on public.enquiries(status);
create index enquiries_created_at_idx on public.enquiries(created_at desc);
