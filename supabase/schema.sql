-- Ledger/Points — Supabase schema
-- Paste into the SQL editor after creating the project.

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now(),
  source text default 'landing'
);

create table if not exists user_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  card_id text not null,
  added_at timestamptz default now(),
  unique(user_id, card_id)
);

create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  origin text not null,
  destination text not null,
  depart_date date not null,
  cabin text not null,
  card_ids text[] not null,
  results jsonb not null,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;
drop policy if exists "anyone can insert waitlist" on waitlist;
create policy "anyone can insert waitlist" on waitlist
  for insert with check (true);

alter table user_cards enable row level security;
drop policy if exists "users manage own cards" on user_cards;
create policy "users manage own cards" on user_cards
  for all using (auth.uid() = user_id);

alter table searches enable row level security;
drop policy if exists "users read own searches" on searches;
create policy "users read own searches" on searches
  for select using (auth.uid() = user_id);
drop policy if exists "users insert own searches" on searches;
create policy "users insert own searches" on searches
  for insert with check (auth.uid() = user_id or user_id is null);
