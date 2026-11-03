-- Website form submissions: insert-only access for the public site.
-- Run this in the Supabase SQL editor once.
--
-- Why this exists
-- ---------------
-- The website used to need SUPABASE_SERVICE_ROLE_KEY to write these rows. That
-- key carries the BYPASSRLS attribute, so a leak from either public-facing
-- Worker would expose every table in the project, including the personal
-- details in contact_messages and visitors. The legacy service_role key is
-- also being retired by Supabase at the end of 2026.
--
-- Instead the site writes with the publishable key (sb_publishable_...), which
-- resolves to the `anon` role, and the policies below let that role INSERT into
-- exactly three tables and read nothing at all. A leaked publishable key can
-- add a row; it cannot read a single message, visitor or testimony.
--
-- Because `anon` has no SELECT policy on these tables, the API routes must send
-- `Prefer: return=minimal` and must not ask for the inserted row back.

-- ── Quiz results ───────────────────────────────────────────────────────────
-- New table. Department quiz results used to go only to a Google Sheet.
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references public.branches (id) on delete set null,
  branch_name text not null,
  language text not null default 'en',
  department_1 text,
  department_2 text,
  department_3 text,
  site text not null,
  workspace text not null default 'kharis',
  created_at timestamptz not null default now()
);

create index if not exists quiz_results_created_at_idx
  on public.quiz_results (created_at desc);

create index if not exists quiz_results_branch_idx
  on public.quiz_results (branch_id);

alter table public.quiz_results enable row level security;

-- ── Insert-only policies ───────────────────────────────────────────────────
-- Each table gets exactly one policy: anon may INSERT, nothing may SELECT,
-- UPDATE or DELETE. The content studio reads these tables with its own
-- authenticated/service credentials, which these policies do not affect.

drop policy if exists "Website may submit contact messages" on public.contact_messages;
create policy "Website may submit contact messages"
  on public.contact_messages
  for insert
  to anon
  with check (true);

drop policy if exists "Website may submit visits" on public.visitors;
create policy "Website may submit visits"
  on public.visitors
  for insert
  to anon
  with check (true);

drop policy if exists "Website may submit quiz results" on public.quiz_results;
create policy "Website may submit quiz results"
  on public.quiz_results
  for insert
  to anon
  with check (true);

-- Grants are checked before RLS. Supabase grants these by default on new
-- tables in `public`; these statements make the intent explicit and are safe
-- to re-run. Note there is deliberately no `select` grant for anon.
grant insert on public.contact_messages to anon;
grant insert on public.visitors to anon;
grant insert on public.quiz_results to anon;

-- ── Confirming it worked ───────────────────────────────────────────────────
-- Inserts should succeed and reads should come back empty for the anon role:
--
--   set local role anon;
--   insert into public.quiz_results (branch_name, site) values ('London', 'Main site');
--   select count(*) from public.quiz_results;  -- expect 0 rows visible
--   reset role;
