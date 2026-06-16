import { Hero } from "./hero";
import { Diferenciais } from "./diferenciais";
import { Formacao } from "./formacao";
import { Professores } from "./professores";
import { Estrutura } from "./estrutura";
import { CtaFinal } from "./cta-final";
import type { UtmParams } from "@florence/umbrella";

export function MedicinaPage({ utm }: { utm?: UtmParams }) {
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
