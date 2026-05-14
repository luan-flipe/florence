-- Florence — Schema inicial
-- Criado em: 14/05/2026

-- Leads capturados pelas LPs
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null,
  course      text not null,
  created_at  timestamptz not null default now()
);

-- Status de cada lead no kanban
create table if not exists lead_status (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references leads(id) on delete cascade,
  status     text not null check (status in ('novo', 'contactado', 'matriculado', 'perdido')),
  updated_at timestamptz not null default now()
);

-- Comentários dos comerciais em cada lead
create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references leads(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  text       text not null,
  created_at timestamptz not null default now()
);

-- Perfis de usuário (admin ou comercial)
create table if not exists user_profiles (
  id      uuid primary key references auth.users(id) on delete cascade,
  email   text not null,
  role    text not null check (role in ('admin', 'comercial')),
  courses text[] not null default '{}'
);

-- Ao inserir um lead, cria automaticamente o status inicial como 'novo'
create or replace function handle_new_lead()
returns trigger as $$
begin
  insert into lead_status (lead_id, status)
  values (new.id, 'novo');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_lead_created
  after insert on leads
  for each row execute procedure handle_new_lead();

-- RLS
alter table leads         enable row level security;
alter table lead_status   enable row level security;
alter table comments      enable row level security;
alter table user_profiles enable row level security;

-- Admin vê tudo; comercial vê apenas cursos atribuídos
create policy "leads_select" on leads for select
  using (
    exists (
      select 1 from user_profiles
      where id = auth.uid()
        and (role = 'admin' or course = any(courses))
    )
  );

create policy "leads_insert_anon" on leads for insert
  with check (true);

create policy "lead_status_select" on lead_status for select
  using (
    exists (
      select 1 from user_profiles up
      join leads l on l.id = lead_status.lead_id
      where up.id = auth.uid()
        and (up.role = 'admin' or l.course = any(up.courses))
    )
  );

create policy "lead_status_update" on lead_status for update
  using (
    exists (
      select 1 from user_profiles up
      join leads l on l.id = lead_status.lead_id
      where up.id = auth.uid()
        and (up.role = 'admin' or l.course = any(up.courses))
    )
  );

create policy "comments_select" on comments for select
  using (
    exists (
      select 1 from user_profiles up
      join leads l on l.id = comments.lead_id
      where up.id = auth.uid()
        and (up.role = 'admin' or l.course = any(up.courses))
    )
  );

create policy "comments_insert" on comments for insert
  with check (
    exists (
      select 1 from user_profiles up
      join leads l on l.id = comments.lead_id
      where up.id = auth.uid()
        and (up.role = 'admin' or l.course = any(up.courses))
    )
  );

create policy "user_profiles_select" on user_profiles for select
  using (auth.uid() = id or exists (
    select 1 from user_profiles where id = auth.uid() and role = 'admin'
  ));
