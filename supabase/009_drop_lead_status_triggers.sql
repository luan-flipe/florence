-- supabase/009_drop_lead_status_triggers.sql
-- CORRECAO URGENTE: a cleanup-banco-florence.sql dropou as tabelas do dashboard
-- (lead_status, lead_status_history) mas deixou os triggers/funcoes que gravavam
-- nelas. Resultado: TODO insert em `leads` falha com
--   42P01: relation "lead_status" does not exist
-- (o trigger on_lead_created chama handle_new_lead() que insere em lead_status).
--
-- Isso quebra a captacao de leads em PRODUCAO tambem. Rodar no SQL Editor ASAP.

begin;

-- Trigger que populava lead_status a cada novo lead (tabela ja nao existe)
drop trigger if exists on_lead_created on leads;
drop function if exists handle_new_lead();

-- Funcao orfa que gravava no historico (tabela ja nao existe)
drop function if exists log_status_change();

-- Observacao: o trigger on_lead_update + touch_lead_updated_at() podem
-- permanecer (apenas atualizam leads.updated_at, nao referenciam tabelas
-- removidas).

commit;

notify pgrst, 'reload schema';
