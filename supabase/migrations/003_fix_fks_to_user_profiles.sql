-- Florence — Migration 003: aponta FKs para user_profiles
-- Criado em: 15/05/2026
--
-- Motivo: leads.assigned_to, lead_status_history.changed_by e comments.user_id
-- referenciavam auth.users, mas as queries do dashboard fazem joins com user_profiles.
-- Como user_profiles.id já espelha auth.users.id (1:1 via FK), basta apontar
-- as FKs diretamente para user_profiles para o PostgREST auto-descobrir o join.

-- leads.assigned_to → user_profiles.id
alter table leads drop constraint if exists leads_assigned_to_fkey;
alter table leads
  add constraint leads_assigned_to_fkey
  foreign key (assigned_to) references user_profiles(id) on delete set null;

-- lead_status_history.changed_by → user_profiles.id
alter table lead_status_history drop constraint if exists lead_status_history_changed_by_fkey;
alter table lead_status_history
  add constraint lead_status_history_changed_by_fkey
  foreign key (changed_by) references user_profiles(id) on delete set null;

-- comments.user_id → user_profiles.id
alter table comments drop constraint if exists comments_user_id_fkey;
alter table comments
  add constraint comments_user_id_fkey
  foreign key (user_id) references user_profiles(id) on delete cascade;

-- Força refresh do PostgREST schema cache
notify pgrst, 'reload schema';
