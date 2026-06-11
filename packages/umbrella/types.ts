import type { Curso } from "./curso-modal";
export type { Curso };

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export interface UmbrellaConfig {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    imageAlt: string;
    stats: { value: string; label: string }[];
  };
  prazo: { ativo: boolean; texto: string };
  formulario: {
    titulo: string;
    subtitulo: string;
    cta: string;
    lgpd: string;
    cursoLabel: string;
    cursoPlaceholder: string;
  };
  cursos: {
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    grupos: { area: string; itens: Curso[] }[];
  };
  diferenciais: {
    eyebrow: string;
    lead: { titulo: string; corpo: string };
    pontos: { titulo: string; corpo: string }[];
  };
  ingresso: {
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    formas: { nome: string; descricao: string }[];
  };
  financiamento: {
    eyebrow: string;
    titulo: string;
    descricao: string;
    itens: { nome: string; descricao: string }[];
  };
  depoimentos: {
    ativo: boolean;
    titulo: string;
    cards: { nome: string; turma: string; texto: string; foto: string }[];
  };
  ctaFinal: { headline: string; microcopy: string };
  obrigado: {
    headline: string;
    corpo: string;
    ctaSecundario: { label: string; href: string };
  };
}
