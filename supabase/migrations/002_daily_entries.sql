-- Daily reading and daily prayer for the content studio / mobile app.
-- The studio expects this table. It is not created by 001_contact_messages.sql.
-- Run once in the Supabase SQL editor. Safe to re-run.

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  workspace text not null default 'app',
  kind text not null check (kind in ('reading', 'prayer')),
  date date,
  title text,
  body text,
  reference text,
  created_at timestamptz not null default now()
);

create index if not exists daily_entries_workspace_kind_date_idx
  on public.daily_entries (workspace, kind, date desc);

alter table public.daily_entries enable row level security;

drop policy if exists "Public can read daily entries" on public.daily_entries;
create policy "Public can read daily entries"
  on public.daily_entries
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can write daily entries" on public.daily_entries;
create policy "Authenticated can write daily entries"
  on public.daily_entries
  for all
  to authenticated
  using (true)
  with check (true);

grant select on public.daily_entries to anon, authenticated;
grant insert, update, delete on public.daily_entries to authenticated;
