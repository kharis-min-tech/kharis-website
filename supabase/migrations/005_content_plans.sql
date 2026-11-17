-- Plans catalogue + future app progress.
-- Run in the Supabase SQL editor. Safe to re-run.
-- Studio continues to use app_config until the Kharis API allowlists content_plans.

create table if not exists public.content_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  summary text not null default '',
  cover_image_url text not null default '',
  mode text not null default 'mixed'
    check (mode in ('scriptures', 'messages', 'mixed')),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  pace text not null default 'self_paced'
    check (pace in ('self_paced', 'calendar')),
  start_date date,
  audience text[] not null default '{}',
  estimated_minutes_per_day integer,
  sequential_unlock boolean not null default false,
  -- Canonical body: [{ id, title, items: [...] }] — same shape as studio JSON
  days jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_plans_status_updated_idx
  on public.content_plans (status, updated_at desc);

alter table public.content_plans enable row level security;

drop policy if exists "Public can read published plans" on public.content_plans;
create policy "Public can read published plans"
  on public.content_plans
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Authenticated can manage plans" on public.content_plans;
create policy "Authenticated can manage plans"
  on public.content_plans
  for all
  to authenticated
  using (true)
  with check (true);

grant select on public.content_plans to anon, authenticated;
grant insert, update, delete on public.content_plans to authenticated;

-- App progress (unused until the mobile app ships; safe to create now)
create table if not exists public.content_plan_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_id uuid not null references public.content_plans (id) on delete cascade,
  current_day_index integer not null default 0,
  completed_item_ids text[] not null default '{}',
  completed_day_indexes integer[] not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create index if not exists content_plan_progress_user_idx
  on public.content_plan_progress (user_id);

alter table public.content_plan_progress enable row level security;

drop policy if exists "Users manage own plan progress" on public.content_plan_progress;
create policy "Users manage own plan progress"
  on public.content_plan_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.content_plan_progress to authenticated;
