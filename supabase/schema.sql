-- =====================================================================
-- IT-Fix  |  Support Informatique
-- Schema Supabase : Tables A (employees), B (technicians), C (tickets)
-- + Row Level Security (RLS) + Storage bucket 'bug-screenshots'
-- =====================================================================
-- Comment exécuter ce fichier :
--   1. Ouvre ton projet Supabase -> SQL Editor -> New query
--   2. Colle tout ce fichier, clique "Run"
--   3. Ensuite exécute seed.sql pour insérer des techniciens de test
-- =====================================================================

-- Extensions utiles
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- TABLE A : employees  (profil étendu lié à auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.employees (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  department    text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TABLE B : technicians  (ressources consultables par tous)
-- ---------------------------------------------------------------------
create table if not exists public.technicians (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  speciality    text not null,         -- ex : Hardware, Network, Software
  email         text,
  phone         text,
  available     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TABLE C : tickets  (interactions entre A et B)
-- ---------------------------------------------------------------------
create table if not exists public.tickets (
  id              uuid primary key default gen_random_uuid(),
  employee_id     uuid not null references public.employees(id) on delete cascade,
  technician_id   uuid not null references public.technicians(id) on delete restrict,
  title           text not null,
  description     text not null,
  screenshot_path text,                 -- chemin dans le bucket Storage
  status          text not null default 'open'
                    check (status in ('open','in_progress','resolved','cancelled')),
  priority        text not null default 'medium'
                    check (priority in ('low','medium','high','urgent')),
  created_at      timestamptz not null default now(),
  resolved_at     timestamptz
);

create index if not exists tickets_employee_idx on public.tickets(employee_id);
create index if not exists tickets_technician_idx on public.tickets(technician_id);

-- ---------------------------------------------------------------------
-- TRIGGER : crée automatiquement une ligne employees à l'inscription
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.employees (id, full_name, department)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'department'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- ROW LEVEL SECURITY  (critère éliminatoire)
-- =====================================================================

-- ---- employees : chaque utilisateur ne voit/modifie que SA ligne ----
alter table public.employees enable row level security;

drop policy if exists "employees select self" on public.employees;
create policy "employees select self" on public.employees
  for select using (auth.uid() = id);

drop policy if exists "employees update self" on public.employees;
create policy "employees update self" on public.employees
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "employees insert self" on public.employees;
create policy "employees insert self" on public.employees
  for insert with check (auth.uid() = id);

-- ---- technicians : catalogue public (auth requise) ------------------
alter table public.technicians enable row level security;

drop policy if exists "technicians read for authenticated" on public.technicians;
create policy "technicians read for authenticated" on public.technicians
  for select to authenticated using (true);

-- ---- tickets : chaque employé ne voit QUE ses tickets ---------------
alter table public.tickets enable row level security;

drop policy if exists "tickets select own" on public.tickets;
create policy "tickets select own" on public.tickets
  for select using (auth.uid() = employee_id);

drop policy if exists "tickets insert own" on public.tickets;
create policy "tickets insert own" on public.tickets
  for insert with check (auth.uid() = employee_id);

drop policy if exists "tickets update own" on public.tickets;
create policy "tickets update own" on public.tickets
  for update using (auth.uid() = employee_id) with check (auth.uid() = employee_id);

drop policy if exists "tickets delete own" on public.tickets;
create policy "tickets delete own" on public.tickets
  for delete using (auth.uid() = employee_id);

-- =====================================================================
-- STORAGE : bucket pour les captures d'écran de bugs
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('bug-screenshots', 'bug-screenshots', false)
on conflict (id) do nothing;

-- Policies : le chemin commence par le uid de l'utilisateur
-- ex : "<uid>/<ticket-id>.png"
drop policy if exists "screenshots upload own" on storage.objects;
create policy "screenshots upload own" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'bug-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "screenshots read own" on storage.objects;
create policy "screenshots read own" on storage.objects
  for select to authenticated using (
    bucket_id = 'bug-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "screenshots delete own" on storage.objects;
create policy "screenshots delete own" on storage.objects
  for delete to authenticated using (
    bucket_id = 'bug-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
