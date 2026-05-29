-- supabase/cleanup-banco-florence.sql
--
-- ONE-SHOT: dropa tudo do dashboard, mantem apenas o necessario para as LPs (insert de leads).
--
-- CONTEXTO:
-- O dashboard saiu deste projeto e foi para um repo separado
-- (C:\Users\luan.oliveira\Documents\Projetos\dashboard-marketing). Este banco
-- Supabase deixa de hospedar a aplicacao do dashboard. Aqui ficam apenas os
-- leads que as LPs (medicina + futuras) inserem via /api/leads.
--
-- O QUE PERMANECE:
--   - tabela `leads` (com todas as colunas atuais: nome, email, phone, course, UTM)
--   - policy de INSERT para role anon (LP envia direto com supabase-js)
--
-- O QUE E REMOVIDO (tudo via drop ... if exists, tolerante a tabelas faltando):
--   - tabelas: lead_status, lead_status_history, comments, user_profiles
--   - tabelas v2 (se foram aplicadas): tenants, tenant_admin_actions
--   - colunas v2 em leads (se aplicadas): tenant_id
--   - funcoes: auth_role, auth_courses, auth_tenant_id
--   - policies herdadas em leads (sao recriadas no final)
--
-- USO: copiar e colar inteiro no Supabase SQL Editor. Roda em uma transacao.
-- Em caso de erro, nada e commitado.

begin;

-- 1. Drop policies na tabela `leads` (a unica que vamos manter).
--    Precisamos limpar policies herdadas porque dependem de funcoes (auth_role,
--    auth_courses) que serao dropadas mais abaixo.
drop policy if exists "leads_select"          on leads;
drop policy if exists "leads_insert"          on leads;
drop policy if exists "leads_insert_anon"     on leads;
drop policy if exists "leads_update"          on leads;
drop policy if exists "leads_delete"          on leads;
drop policy if exists "leads_anon_insert"     on leads;

-- 2. Drop tabelas. O `cascade` ja remove policies, FKs, triggers e indices
--    dependentes automaticamente. `if exists` torna o script tolerante a
--    tabelas que nunca chegaram a ser criadas (caso da V2 nao aplicada).
drop table if exists tenant_admin_actions cascade;
drop table if exists tenants              cascade;
drop table if exists lead_status_history  cascade;
drop table if exists lead_status          cascade;
drop table if exists comments             cascade;
drop table if exists user_profiles        cascade;

-- 3. Drop funcoes helper de RLS (so existiam pelo dashboard).
drop function if exists auth_role()        cascade;
drop function if exists auth_courses()     cascade;
drop function if exists auth_tenant_id()   cascade;

-- 4. Remover coluna tenant_id de leads, caso a migration 005 do dashboard
--    tenha sido aplicada antes deste cleanup. `if exists` cobre o caso normal
--    (nao aplicada) sem erro.
alter table leads drop column if exists tenant_id;

-- 5. Recria policy minima de INSERT anon para a LP.
--    A LP /api/leads do Next.js usa o supabaseAdmin() com service_role
--    (que bypassa RLS), entao a policy abaixo serve apenas para
--    cliente publico via supabase-js (caso seja usado direto do browser).
alter table leads enable row level security;

create policy "leads_anon_insert" on leads
  for insert to anon
  with check (true);

-- 6. (Opcional) Limpeza dos usuarios em auth.users que existiam apenas
--    para acesso ao dashboard. NAO executamos automaticamente porque pode
--    haver outros usos. Para limpar manualmente depois:
--
--   delete from auth.users
--   where email in ('georgia@florence.edu.br', 'system@luanfelipe.com.br', ...);

commit;

notify pgrst, 'reload schema';
