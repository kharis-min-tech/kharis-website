-- Contact form submissions (Kharis website)
-- Run this in the Supabase SQL editor once.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  topic text not null,
  branch text,
  message text not null,
  workspace text not null default 'kharis',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

alter table public.contact_messages enable row level security;

-- Public clients cannot read or write directly.
-- Inserts go through the Next.js API using the service role key.
drop policy if exists "No public access to contact_messages" on public.contact_messages;
