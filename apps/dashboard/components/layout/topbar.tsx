import type { UserProfile } from "@/types/database";
import { ROLE_LABELS } from "@/lib/roles";

export function Topbar({ profile, title }: { profile: UserProfile; title: string }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <h1 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium tracking-wide">
          {ROLE_LABELS[profile.role]}
        </span>
      </div>
    </header>
  );
}
