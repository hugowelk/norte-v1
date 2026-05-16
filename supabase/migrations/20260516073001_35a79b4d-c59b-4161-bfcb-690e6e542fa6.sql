create table public.reports (
  id text primary key,
  created_at timestamptz not null default now(),
  payment_session_id text not null unique,
  input_data jsonb not null,
  report_markdown text not null,
  view_count integer not null default 0,
  paid boolean not null default true
);

create index idx_reports_payment_session on public.reports(payment_session_id);

alter table public.reports enable row level security;

create policy "reports_public_read"
  on public.reports
  for select
  using (true);