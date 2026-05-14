import { Hero } from "@/components/sections/hero";
import { Diferenciais } from "@/components/sections/diferenciais";
import { Formacao } from "@/components/sections/formacao";
import { Professores } from "@/components/sections/professores";
import { Estrutura } from "@/components/sections/estrutura";
import { CtaFinal } from "@/components/sections/cta-final";

export default function Home() {
  return (
    <main>
      <Hero />
      <Diferenciais />
      <Formacao />
      <Professores />
      <Estrutura />
      <CtaFinal />
    </main>
  );
}
