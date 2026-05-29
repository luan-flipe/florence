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
-- O QUE E REMOVIDO:
--   - tabelas: lead_status, lead_status_history, comments, user_profiles
--   - tabelas v2 (se foram aplicadas): tenants, tenant_admin_actions
--   - colunas v2 em leads (se aplicadas): tenant_id
--   - funcoes: auth_role, auth_courses, auth_tenant_id
--   - todas as policies relacionadas ao dashboard
--
-- USO: copiar e colar inteiro no Supabase SQL Editor. Roda em uma transacao.
-- Em caso de erro, nada e commitado.

begin;

-- 1. Drop policies que dependem de funcoes/tabelas que serao removidas.
--    Usamos `drop policy if exists` para ser idempotente.

-- LEADS (preservamos a tabela, mas todas as policies antigas sao trocadas)
drop policy if exists "leads_select"          on leads;
drop policy if exists "leads_insert"          on leads;
drop policy if exists "leads_insert_anon"     on leads;
drop policy if exists "leads_update"          on leads;
drop policy if exists "leads_delete"          on leads;
drop policy if exists "leads_anon_insert"     on leads;

-- Demais policies em tabelas que serao dropadas (drop policy implicito pelo DROP TABLE,
-- mas listamos por clareza/auditoria).
drop policy if exists "lead_status_select"        on lead_status;
drop policy if exists "lead_status_update"        on lead_status;
drop policy if exists "lead_status_modify"        on lead_status;
drop policy if exists "comments_select"           on comments;
drop policy if exists "comments_insert"           on comments;
drop policy if exists "comments_update"           on comments;
drop policy if exists "comments_delete"           on comments;
drop policy if exists "history_select"            on lead_status_history;
drop policy if exists "lead_status_history_select" on lead_status_history;
drop policy if exists "lead_status_history_insert" on lead_status_history;
drop policy if exists "user_profiles_select"      on user_profiles;
drop policy if exists "user_profiles_insert"      on user_profiles;
drop policy if exists "user_profiles_update"      on user_profiles;
drop policy if exists "tenants_select_phase1"     on tenants;
drop policy if exists "tenants_all"               on tenants;
drop policy if exists "tenants_select_own"        on tenants;
drop policy if exists "tenant_admin_actions_select_phase1" on tenant_admin_actions;
drop policy if exists "tenant_admin_actions_all"  on tenant_admin_actions;

-- 2. Drop tabelas v2 primeiro (dependem de outras via FK)
drop table if exists tenant_admin_actions cascade;
drop table if exists tenants              cascade;

-- 3. Drop tabelas v1 do dashboard (ordem importa por FK)
drop table if exists lead_status_history cascade;
drop table if exists lead_status         cascade;
drop table if exists comments            cascade;
drop table if exists user_profiles       cascade;

-- 4. Drop funcoes helper de RLS (so existiam pelo dashboard)
drop function if exists auth_role();
drop function if exists auth_courses();
drop function if exists auth_tenant_id();

-- 5. Remover coluna tenant_id de leads, caso a migration 005 do dashboard
--    tenha sido aplicada antes deste cleanup.
alter table leads drop column if exists tenant_id;

-- 6. Drop constraint de check do role em leads se ela ficou orfa
--    (nao deveria, mas garante).
alter table leads drop constraint if exists leads_status_check;

-- 7. Recria policy minima de INSERT anon para a LP.
--    A LP /api/leads do Next.js usa o supabaseAdmin() com service_role
--    (que bypassa RLS), entao a policy abaixo serve apenas para
--    cliente publico via supabase-js (caso seja usado direto do browser).
alter table leads enable row level security;

create policy "leads_anon_insert" on leads
  for insert to anon
  with check (true);

-- 8. (Opcional) Limpeza dos usuarios em auth.users que existiam apenas
--    para acesso ao dashboard. NAO executamos automaticamente porque pode
--    haver outros usos. Para limpar manualmente depois:
--
--   delete from auth.users
--   where email in ('georgia@florence.edu.br', 'system@luanfelipe.com.br', ...);

commit;

notify pgrst, 'reload schema';
