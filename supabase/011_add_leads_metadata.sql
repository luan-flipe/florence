-- supabase/011_add_leads_metadata.sql
-- Coluna generica para dados extras por LP (ex: curso de interesse na graduacao).
-- Aditiva e nullable: nao afeta a medicina (que nao grava metadata).

alter table leads add column if not exists metadata jsonb default '{}'::jsonb;

notify pgrst, 'reload schema';
