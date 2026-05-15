"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, KanbanSquare, Users, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import type { UserProfile } from "@/types/database";
import { canAccessAnalytics, canAccessLeads, canManageTeam } from "@/lib/roles";

interface SidebarProps {
  profile: UserProfile;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    canAccessAnalytics(profile.role) && { href: "/analytics", label: "Analytics", icon: BarChart3 },
    canAccessLeads(profile.role)     && { href: "/leads",     label: "Leads",     icon: KanbanSquare },
    canManageTeam(profile.role)      && { href: "/team",      label: "Time",      icon: Users },
  ].filter(Boolean) as { href: string; label: string; icon: typeof BarChart3 }[];

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="font-bold text-lg">Florence</h1>
        <p className="text-xs text-gray-500">Dashboard</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium truncate">{profile.name ?? profile.email}</p>
          <p className="text-xs text-gray-500 truncate">{profile.email}</p>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
}
