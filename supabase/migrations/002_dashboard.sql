-- Florence — Migration 002: Dashboard de leads
-- Criado em: 15/05/2026

-- ─── ALTERAÇÕES EM TABELAS EXISTENTES ──────────────────────────

alter table leads add column updated_at  timestamptz default now();
alter table leads add column assigned_to uuid references auth.users(id);
alter table leads add column utm_source  text;
alter table leads add column utm_medium  text;
alter table leads add column utm_campaign text;
alter table leads add column utm_content text;
alter table leads add column utm_term    text;

create index idx_leads_assigned on leads(assigned_to);
create index idx_leads_course   on leads(course);
create index idx_leads_created  on leads(created_at desc);

-- Funil expandido (6 stages)
alter table lead_status drop constraint lead_status_status_check;
alter table lead_status add constraint lead_status_status_check
  check (status in (
    'novo', 'contactado', 'em_conversa',
    'matricula_iniciada', 'matriculado', 'perdido'
  ));

-- Garante 1 row por lead (current status)
alter table lead_status add constraint lead_status_lead_unique unique (lead_id);

-- Roles expandidas
alter table user_profiles drop constraint user_profiles_role_check;
alter table user_profiles add constraint user_profiles_role_check
  check (role in (
    'super_admin', 'admin_marketing', 'admin_vendas',
    'marketing', 'comercial'
  ));
alter table user_profiles add column name   text;
alter table user_profiles add column active boolean default true;

-- ─── HISTÓRICO DE STATUS ───────────────────────────────────────

create table lead_status_history (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  from_status text,
  to_status   text not null,
  changed_by  uuid references auth.users(id),
  changed_at  timestamptz not null default now()
);
create index idx_history_lead on lead_status_history(lead_id, changed_at desc);

create or replace function log_status_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into lead_status_history (lead_id, from_status, to_status)
    values (new.lead_id, null, new.status);
  elsif (old.status <> new.status) then
    insert into lead_status_history (lead_id, from_status, to_status, changed_by)
    values (new.lead_id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_lead_status_change
  after insert or update on lead_status
  for each row execute procedure log_status_change();

-- ─── TOUCH UPDATED_AT EM LEADS ─────────────────────────────────

create or replace function touch_lead_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_lead_update
  before update on leads
  for each row execute procedure touch_lead_updated_at();

-- ─── RLS HELPER ────────────────────────────────────────────────

create or replace function auth_role()
returns text language sql security definer stable as $$
  select role from user_profiles where id = auth.uid()
$$;

create or replace function auth_courses()
returns text[] language sql security definer stable as $$
  select courses from user_profiles where id = auth.uid()
$$;

-- ─── RLS POLICIES ──────────────────────────────────────────────

-- LEADS
drop policy if exists "leads_select" on leads;
create policy "leads_select" on leads for select using (
  auth_role() in ('super_admin', 'admin_marketing', 'admin_vendas', 'marketing')
  or (
    auth_role() = 'comercial'
    and course = any(auth_courses())
  )
);

create policy "leads_update" on leads for update using (
  auth_role() in ('super_admin', 'admin_vendas')
  or (
    auth_role() = 'comercial'
    and course = any(auth_courses())
  )
);

-- LEAD_STATUS
drop policy if exists "lead_status_select" on lead_status;
drop policy if exists "lead_status_update" on lead_status;
create policy "lead_status_select" on lead_status for select using (
  auth_role() in ('super_admin', 'admin_marketing', 'admin_vendas', 'marketing')
  or exists (
    select 1 from leads l
    where l.id = lead_status.lead_id
      and auth_role() = 'comercial'
      and l.course = any(auth_courses())
  )
);
create policy "lead_status_update" on lead_status for update using (
  auth_role() in ('super_admin', 'admin_vendas')
  or exists (
    select 1 from leads l
    where l.id = lead_status.lead_id
      and auth_role() = 'comercial'
      and l.course = any(auth_courses())
  )
);

-- LEAD_STATUS_HISTORY (read-only)
alter table lead_status_history enable row level security;
create policy "history_select" on lead_status_history for select using (
  exists (
    select 1 from leads l
    where l.id = lead_status_history.lead_id
      and (
        auth_role() in ('super_admin', 'admin_marketing', 'admin_vendas', 'marketing')
        or (auth_role() = 'comercial'
          and l.course = any(auth_courses()))
      )
  )
);

-- USER_PROFILES (admin pode listar usuários da sua área)
drop policy if exists "user_profiles_select" on user_profiles;
create policy "user_profiles_select" on user_profiles for select using (
  auth_role() = 'super_admin'
  or (auth_role() = 'admin_vendas' and role in ('comercial', 'admin_vendas'))
  or (auth_role() = 'admin_marketing' and role in ('marketing', 'admin_marketing'))
  or auth.uid() = id
);

-- ─── REALTIME ──────────────────────────────────────────────────

alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table lead_status;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table lead_status_history;
