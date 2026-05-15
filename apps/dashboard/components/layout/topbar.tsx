import type { UserProfile } from "@/types/database";
import { ROLE_LABELS } from "@/lib/roles";

export function Topbar({ profile, title }: { profile: UserProfile; title: string }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
          {ROLE_LABELS[profile.role]}
        </span>
      </div>
    </header>
  );
}
