"use client";
import { CursoInteresseProvider } from "./curso-interesse-context";
import { Hero } from "./sections/hero";
import { Cursos } from "./sections/cursos";
import { Diferenciais } from "./sections/diferenciais";
import { Ingresso } from "./sections/ingresso";
import { Financiamento } from "./sections/financiamento";
import { Depoimentos } from "./sections/depoimentos";
import { CtaFinal } from "./sections/cta-final";
import { WhatsappButton } from "./whatsapp-button";
import type { UmbrellaConfig, UtmParams } from "./types";

interface UmbrellaPageProps {
  config: UmbrellaConfig;
  cursoOptions: string[];
  utm?: UtmParams;
}

export function UmbrellaPage({ config, cursoOptions, utm }: UmbrellaPageProps) {
  return (
    <CursoInteresseProvider>
      <main>
        <Hero hero={config.hero} formulario={config.formulario} prazo={config.prazo} cursoOptions={cursoOptions} utm={utm} />
        <Cursos cursos={config.cursos} />
        <Diferenciais diferenciais={config.diferenciais} />
        <Ingresso ingresso={config.ingresso} />
        <Financiamento financiamento={config.financiamento} />
        <Depoimentos depoimentos={config.depoimentos} />
        <CtaFinal ctaFinal={config.ctaFinal} formulario={config.formulario} cursoOptions={cursoOptions} utm={utm} />
      </main>
      {config.whatsapp && (
        <WhatsappButton numero={config.whatsapp.numero} mensagem={config.whatsapp.mensagem} />
      )}
    </CursoInteresseProvider>
  );
}
