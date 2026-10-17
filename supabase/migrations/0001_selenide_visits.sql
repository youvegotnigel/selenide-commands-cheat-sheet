-- Single-row visitor counter for the Selenide cheat sheet. It shares the
-- Supabase project with the Playwright cheat sheet but has its own table and
-- RPC, so the two counts never mix.
create table if not exists public.selenide_visits (
  id integer primary key default 1,
  total_count bigint not null default 0
);
insert into public.selenide_visits (id, total_count)
  values (1, 0)
  on conflict (id) do nothing;

-- Atomic increment (avoids race conditions under concurrent hits)
create or replace function public.increment_selenide_visits()
returns void
language sql
as $$
  update public.selenide_visits set total_count = total_count + 1 where id = 1;
$$;

-- Only the Edge Function (service role) may call the increment
revoke execute on function public.increment_selenide_visits() from public, anon, authenticated;

-- RLS: allow the public anon key to READ only
alter table public.selenide_visits enable row level security;

drop policy if exists "Allow public read" on public.selenide_visits;
create policy "Allow public read"
  on public.selenide_visits for select
  using (true);
