import { headers } from "next/headers";
import { UmbrellaPage } from "@florence/umbrella";
import { resolveLp } from "@/lib/registry";
import { MedicinaPage } from "@/components/medicina/medicina-page";
import type { UtmParams } from "@florence/umbrella";

export default function Home({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const host = headers().get("host");
  const entry = resolveLp(host, searchParams.lp);
  const utm: UtmParams = {
    utm_source: searchParams.utm_source ?? null,
    utm_medium: searchParams.utm_medium ?? null,
    utm_campaign: searchParams.utm_campaign ?? null,
    utm_content: searchParams.utm_content ?? null,
    utm_term: searchParams.utm_term ?? null,
  };
  if (entry.kind === "medicina") return <MedicinaPage utm={utm} />;
  return <UmbrellaPage config={entry.config} cursoOptions={entry.cursoOptions} utm={utm} />;
}
