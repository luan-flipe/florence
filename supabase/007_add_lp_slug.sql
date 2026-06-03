-- supabase/007_add_lp_slug.sql
-- Fase aditiva do rename course -> lp_slug. RODAR NO SQL EDITOR ANTES do merge
-- do codigo dual-write (e antes de testar o formulario no preview, que escreve
-- no mesmo banco). Seguro com a producao atual: a coluna e nullable e o codigo
-- live (que so escreve `course`) continua funcionando.

begin;

-- 1. Coluna nova, nullable
alter table leads add column if not exists lp_slug text;

-- 2. Backfill do historico (todos os leads atuais sao da LP de medicina)
update leads set lp_slug = 'medicina' where lp_slug is null;

commit;

notify pgrst, 'reload schema';
