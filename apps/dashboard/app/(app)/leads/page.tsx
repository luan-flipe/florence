import { requireProfile } from "@/lib/auth";
import { Topbar } from "@/components/layout/topbar";

export default async function LeadsPage() {
  const profile = await requireProfile();
  return (
    <>
      <Topbar profile={profile} title="Leads" />
      <main className="flex-1 p-6"><p>Em construção…</p></main>
    </>
  );
}
