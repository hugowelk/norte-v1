create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "anyone can join waitlist"
on public.waitlist
for insert
to anon, authenticated
with check (
  length(trim(name)) between 1 and 100
  and length(email) between 3 and 255
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);