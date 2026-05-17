alter table public.users enable row level security;
alter table public.countries enable row level security;
alter table public.licenses enable row level security;
alter table public.regulations enable row level security;
alter table public.compliance_requests enable row level security;
alter table public.compliance_reports enable row level security;
alter table public.ai_generations enable row level security;
alter table public.regulatory_chunks enable row level security;
alter table public.regulation_documents enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'wepesi_app') then
    create policy "wepesi_app_full_access" on public.users for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.countries for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.licenses for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.regulations for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.compliance_requests for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.compliance_reports for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.ai_generations for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.regulatory_chunks for all to wepesi_app using (true) with check (true);
    create policy "wepesi_app_full_access" on public.regulation_documents for all to wepesi_app using (true) with check (true);
  end if;
exception
  when duplicate_object then
    null;
end $$;
