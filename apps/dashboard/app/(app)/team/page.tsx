import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Topbar } from "@/components/layout/topbar";
import { UserList } from "@/components/team/user-list";
import { CreateUserModal } from "@/components/team/create-user-modal";
import type { UserRole } from "@/types/database";

export default async function TeamPage() {
  const profile = await requireRole(["super_admin", "admin_marketing", "admin_vendas"]);

  const allowedRoles: UserRole[] =
    profile.role === "super_admin"
      ? ["super_admin", "admin_marketing", "admin_vendas", "marketing", "comercial"]
      : profile.role === "admin_marketing"
      ? ["marketing", "admin_marketing"]
      : ["comercial", "admin_vendas"];

  const supabase = createClient();
  const { data: users } = await supabase
    .from("user_profiles")
    .select("*")
    .order("email", { ascending: true });

  return (
    <>
      <Topbar profile={profile} title="Time" />
      <main className="flex-1 p-6 overflow-auto space-y-4">
        <div className="flex justify-end">
          <CreateUserModal allowedRoles={allowedRoles} />
        </div>
        <UserList users={(users ?? []) as never} />
      </main>
    </>
  );
}
