import { UmbrellaPage, type UtmParams } from "@florence/umbrella";
import { config, cursoOptions } from "@/content/graduacao";

export default function Home({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const utm: UtmParams = {
    utm_source: searchParams.utm_source ?? null,
    utm_medium: searchParams.utm_medium ?? null,
    utm_campaign: searchParams.utm_campaign ?? null,
    utm_content: searchParams.utm_content ?? null,
    utm_term: searchParams.utm_term ?? null,
  };
  return <UmbrellaPage config={config} cursoOptions={cursoOptions} utm={utm} />;
}
