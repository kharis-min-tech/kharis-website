-- Giving page URL for each branch.
-- Run this in the Supabase SQL editor once.
-- Content Studio saves it, and the Kharis and KP2 give pages use it.

alter table public.branches
  add column if not exists giving_link text;

-- Fill KP2 branches that do not have a link yet.
-- A link already saved in Content Studio is left as it is.
update public.branches set giving_link = 'https://give.tithe.ly/?formId=f5809c09-eacf-475a-a31c-5b722718f237'
  where slug = 'kp2-barking' and coalesce(btrim(giving_link), '') = '';
update public.branches set giving_link = 'https://give.tithe.ly/?formId=1fb872e2-0696-4bef-9a95-36d61a3512cf'
  where slug = 'kp2-birmingham' and coalesce(btrim(giving_link), '') = '';
update public.branches set giving_link = 'https://give.tithe.ly/?formId=1f9358c0-6226-4abf-a526-4ef17e002c2f'
  where slug = 'kp2-london' and coalesce(btrim(giving_link), '') = '';
update public.branches set giving_link = 'https://give.tithe.ly/?formId=5a5d795a-ec95-480b-b047-8fee14c04789'
  where slug = 'kp2-peterborough' and coalesce(btrim(giving_link), '') = '';
update public.branches set giving_link = 'https://give.tithe.ly/?formId=9bb02537-fd92-492a-bb76-3f2989c16c9d'
  where slug = 'kp2-romford' and coalesce(btrim(giving_link), '') = '';
update public.branches set giving_link = 'https://give.tithe.ly/?formId=a79fdf6d-6849-4751-95ba-dd248b953ea5'
  where slug = 'kp2-southampton' and coalesce(btrim(giving_link), '') = '';
