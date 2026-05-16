import { requireProfile } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { NewLeadToaster } from "@/components/layout/new-lead-toaster";
import { Toaster } from "@/components/ui/sonner";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  return (
    <div className="min-h-[100dvh] flex bg-gray-50 pb-14 md:pb-0">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NewLeadToaster />
        {children}
      </div>
      <BottomNav profile={profile} />
      <Toaster position="top-right" />
    </div>
  );
}
