-- supabase/008_finalize_lp_slug.sql
-- Fase de contracao do rename course -> lp_slug. RODAR NO SQL EDITOR SOMENTE
-- DEPOIS de:
--   (a) merge do codigo dual-write (escreve course + lp_slug) estavel em prod;
--   (b) confirmar via lead de teste que lp_slug esta sendo preenchido;
--   (c) merge do follow-up que para de escrever `course` (so entao o passo 3
--       abaixo e o drop final sao seguros).
--
-- Execute em duas etapas conforme indicado abaixo.

-- ── Etapa 1: tornar lp_slug obrigatorio e relaxar course ──────────────
-- Pode rodar logo apos o dual-write estar estavel.
begin;

update leads set lp_slug = 'medicina' where lp_slug is null;
alter table leads alter column lp_slug set not null;

-- Relaxa course para que o follow-up (que para de escrever course) nao falhe
alter table leads alter column course drop not null;

commit;

-- ── Etapa 2: drop da coluna legada (IRREVERSIVEL) ─────────────────────
-- Rodar SEPARADAMENTE, so depois que NENHUM deploy escreve mais `course`
-- (apos o merge do follow-up de codigo). Descomente e execute:
--
-- begin;
--   alter table leads drop column course;
-- commit;
-- notify pgrst, 'reload schema';

notify pgrst, 'reload schema';
