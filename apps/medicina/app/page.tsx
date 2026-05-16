import { Hero } from "@/components/sections/hero";
import { Diferenciais } from "@/components/sections/diferenciais";
import { Formacao } from "@/components/sections/formacao";
import { Professores } from "@/components/sections/professores";
import { Estrutura } from "@/components/sections/estrutura";
import { CtaFinal } from "@/components/sections/cta-final";

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export default function Home({
  searchParams,
}: { searchParams: Record<string, string | undefined> }) {
  const utm: UtmParams = {
    utm_source:   searchParams.utm_source   ?? null,
    utm_medium:   searchParams.utm_medium   ?? null,
    utm_campaign: searchParams.utm_campaign ?? null,
    utm_content:  searchParams.utm_content  ?? null,
    utm_term:     searchParams.utm_term     ?? null,
  };

  return (
    <main>
      <Hero utm={utm} />
      <Diferenciais />
      <Formacao />
      <Professores />
      <Estrutura />
      <CtaFinal utm={utm} />
    </main>
  );
}
