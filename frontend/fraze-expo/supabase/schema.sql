-- fraze schema: profiles, crews, crew_members, memories (+ RLS)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  pronouns text,
  created_at timestamptz not null default now()
);

create table if not exists public.crews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,               -- "SOUTH OF FRANCE · JUL 2024"
  vibe text default 'amber',   -- hero gradient key
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.crew_members (
  crew_id uuid references public.crews (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (crew_id, user_id)
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  kind text not null check (kind in ('quote', 'term', 'unpostable', 'voice')),
  text text,          -- quote text / term name / voice memo title
  definition text,    -- terms
  usage text,         -- terms
  origin text,        -- terms
  said_by text,       -- quotes: who said it (display name)
  photo_url text,     -- unpostables
  created_at timestamptz not null default now()
);
create index if not exists memories_crew_created on public.memories (crew_id, created_at desc);

-- auto-create profile on signup (display_name from signUp metadata)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'someone'));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: members see their crews' content; delete only your own memories
alter table public.profiles enable row level security;
alter table public.crews enable row level security;
alter table public.crew_members enable row level security;
alter table public.memories enable row level security;

create or replace function public.is_member(crew uuid)
returns boolean language sql security definer set search_path = public as
$$ select exists (select 1 from crew_members where crew_id = crew and user_id = auth.uid()) $$;

create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "update own profile" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "members see crews" on public.crews for select to authenticated using (public.is_member(id));
create policy "anyone creates crews" on public.crews for insert to authenticated with check (created_by = auth.uid());

create policy "see own memberships" on public.crew_members for select to authenticated
  using (user_id = auth.uid() or public.is_member(crew_id));
create policy "join via creator" on public.crew_members for insert to authenticated
  with check (user_id = auth.uid() or exists (select 1 from crews where id = crew_id and created_by = auth.uid()));
create policy "leave crew" on public.crew_members for delete to authenticated using (user_id = auth.uid());

create policy "members read memories" on public.memories for select to authenticated using (public.is_member(crew_id));
create policy "members write memories" on public.memories for insert to authenticated
  with check (author_id = auth.uid() and public.is_member(crew_id));
create policy "delete own memories" on public.memories for delete to authenticated using (author_id = auth.uid());
