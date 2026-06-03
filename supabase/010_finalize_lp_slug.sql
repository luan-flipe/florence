-- supabase/010_finalize_lp_slug.sql
-- Finaliza o rename course -> lp_slug numa unica passada. Seguro porque a LP
-- ainda nao esta sendo veiculada e os leads atuais sao todos de teste.
--
-- ORDEM: rodar DEPOIS que o deploy do codigo que para de escrever `course`
-- (submitLead sem dual-write) estiver Ready em producao. Assim nenhum insert
-- tenta gravar numa coluna inexistente.
--
-- Substitui 008_finalize_lp_slug.sql (que era a versao em etapas).

begin;

-- 1. Limpa os leads de teste (a tabela so tem dados de teste ate aqui)
delete from leads;

-- 2. Garante integridade: toda nova captacao precisa ter lp_slug
alter table leads alter column lp_slug set not null;

-- 3. Remove a coluna legada (IRREVERSIVEL — ok, sem trafego real ainda)
alter table leads drop column if exists course;

commit;

notify pgrst, 'reload schema';
