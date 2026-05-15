import { requireProfile } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  return (
    <div className="min-h-[100dvh] flex bg-gray-50">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
