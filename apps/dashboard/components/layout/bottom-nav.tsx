"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, KanbanSquare, Users } from "lucide-react";
import type { UserProfile } from "@/types/database";
import { canAccessAnalytics, canAccessLeads, canManageTeam } from "@/lib/roles";

export function BottomNav({ profile }: { profile: UserProfile }) {
  const pathname = usePathname();
  const items = [
    canAccessAnalytics(profile.role) && { href: "/analytics", label: "Analytics", icon: BarChart3 },
    canAccessLeads(profile.role)     && { href: "/leads",     label: "Leads",     icon: KanbanSquare },
    canManageTeam(profile.role)      && { href: "/team",      label: "Time",      icon: Users },
  ].filter(Boolean) as { href: string; label: string; icon: typeof BarChart3 }[];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-40">
      <div className="flex justify-around">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${active ? "text-blue-600" : "text-gray-500"}`}>
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
