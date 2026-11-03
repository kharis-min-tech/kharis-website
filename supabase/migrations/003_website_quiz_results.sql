-- Department quiz results, plus a note on how the website writes to the
-- database. Applied to the Kharis Digital project on 2026-11-03 as the
-- `website_quiz_results` migration.
--
-- Why there is no service-role key
-- --------------------------------
-- The website used to need SUPABASE_SERVICE_ROLE_KEY to write form rows. That
-- key carries the BYPASSRLS attribute, so a leak from either public-facing
-- Worker would expose every table in the project, including the personal
-- details in contact_messages and visitors. The legacy service_role key is
-- also being retired by Supabase at the end of 2026.
--
-- Instead the site writes with the publishable key (sb_publishable_...), which
-- resolves to the `anon` role. That role may INSERT into three tables and read
-- none of them. A leaked publishable key can add a row; it cannot read a
-- single message or visitor.
--
-- contact_messages and visitors already had exactly that shape before this
-- migration -- an anon INSERT policy and an INSERT-only grant, with SELECT
-- withheld -- so neither is touched here. Only quiz_results is new.
--
-- `branches` is deliberately readable by anon (policy "branches public read",
-- limited to is_active), which is how the API routes look up the inbox to
-- notify without any elevated credential.
--
-- Because anon has no SELECT on these tables, the API routes must send
-- `Prefer: return=minimal` and must not ask for the inserted row back.

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

-- anon may INSERT and read nothing, matching contact_messages and visitors.
create policy "Website may submit quiz results"
  on public.quiz_results
  for insert
  to anon
  with check (true);

-- The content studio signs in, so authenticated keeps full access.
create policy "quiz admin all"
  on public.quiz_results
  for all
  to authenticated
  using (true)
  with check (true);

-- Grants are checked before RLS. Note there is deliberately no select for anon.
grant insert on public.quiz_results to anon;
grant all on public.quiz_results to authenticated;

-- Confirming it worked
-- --------------------
-- As the anon role the insert succeeds and the read is refused outright, at
-- the grant layer rather than by RLS filtering:
--
--   set local role anon;
--   insert into public.quiz_results (branch_name, site) values ('London', 'Main site');
--   select count(*) from public.quiz_results;  -- ERROR: permission denied
--   reset role;
