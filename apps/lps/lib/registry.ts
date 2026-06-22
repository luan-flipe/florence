import type { UmbrellaConfig, UtmParams } from "@florence/umbrella";
import { config as graduacaoConfig, cursoOptions as graduacaoOptions } from "@/content/graduacao";
import { config as posConfig, cursoOptions as posOptions } from "@/content/pos-graduacao";
import { config as tecnicoConfig, cursoOptions as tecnicoOptions } from "@/content/tecnico";
import { config as medicinaConfig } from "@/content/medicina";

export type { UtmParams };

export interface UmbrellaEntry {
  kind: "umbrella";
  slug: string;
  displayName: string;
  gtmId?: string;
  config: UmbrellaConfig;
  cursoOptions: string[];
  meta: { title: string; description: string };
  obrigado: { headline: string; corpo: string; ctaSecundario: { label: string; href: string } };
}

export interface MedicinaEntry {
  kind: "medicina";
  slug: string;
  displayName: string;
  gtmId?: string;
  meta: { title: string; description: string };
  obrigado: { headline: string; corpo: string; ctaSecundario?: { label: string; href: string } };
}

export type LpEntry = UmbrellaEntry | MedicinaEntry;

const BY_SLUG: Record<string, LpEntry> = {
  graduacao: {
    kind: "umbrella",
    slug: "graduacao",
    displayName: "Graduação Florence",
    config: graduacaoConfig,
    cursoOptions: graduacaoOptions,
    meta: graduacaoConfig.meta,
    obrigado: graduacaoConfig.obrigado,
  },
  "pos-graduacao": {
    kind: "umbrella",
    slug: "pos-graduacao",
    displayName: "Pós Florence",
    config: posConfig,
    cursoOptions: posOptions,
    meta: posConfig.meta,
    obrigado: posConfig.obrigado,
  },
  tecnico: {
    kind: "umbrella",
    slug: "tecnico",
    displayName: "Técnico Florence",
    config: tecnicoConfig,
    cursoOptions: tecnicoOptions,
    meta: tecnicoConfig.meta,
    obrigado: tecnicoConfig.obrigado,
  },
  medicina: {
    kind: "medicina",
    slug: "medicina",
    displayName: "Medicina",
    gtmId: "GTM-MMFZBTKD",
    meta: medicinaConfig.meta,
    obrigado: medicinaConfig.obrigado,
  },
};

const BY_HOST: Record<string, string> = {
  "graduacao.florence.edu.br": "graduacao",
  "pos.florence.edu.br": "pos-graduacao",
  "tecnico.florence.edu.br": "tecnico",
  "curso-tecnico.florence.edu.br": "tecnico",
  "medicina.florence.edu.br": "medicina",
};

const DEFAULT_SLUG = "graduacao";

/**
 * Resolve which LP to render.
 *
 * Priority:
 *  1. `override` query param (?lp=graduacao|pos-graduacao|tecnico|medicina) — for local/preview testing.
 *  2. Request hostname mapped via BY_HOST.
 *  3. Default slug (graduacao).
 */
export function resolveLp(host?: string | null, override?: string | null): LpEntry {
  if (override && BY_SLUG[override]) return BY_SLUG[override];
  if (host) {
    const h = host.split(":")[0].toLowerCase();
    const slug = BY_HOST[h];
    if (slug && BY_SLUG[slug]) return BY_SLUG[slug];
  }
  return BY_SLUG[DEFAULT_SLUG];
}

export { BY_SLUG, BY_HOST };
