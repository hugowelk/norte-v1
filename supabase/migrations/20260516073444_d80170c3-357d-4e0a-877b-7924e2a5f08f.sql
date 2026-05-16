create or replace function public.increment_report_view(p_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reports set view_count = view_count + 1 where id = p_id;
$$;

grant execute on function public.increment_report_view(text) to anon, authenticated;