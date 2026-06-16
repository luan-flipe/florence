import type { UmbrellaConfig, UtmParams } from "@florence/umbrella";
import { config as graduacaoConfig, cursoOptions as graduacaoOptions } from "@/content/graduacao";
import { config as posConfig, cursoOptions as posOptions } from "@/content/pos-graduacao";
import { config as tecnicoConfig, cursoOptions as tecnicoOptions } from "@/content/tecnico";

export type { UtmParams };

export interface UmbrellaEntry {
  kind: "umbrella";
  slug: string;
  displayName: string;
  gtmId?: string;
  config: UmbrellaConfig;
  cursoOptions: string[];
}

// A MedicinaEntry kind will be added later when medicina LP is folded in.
export type LpEntry = UmbrellaEntry;

const BY_SLUG: Record<string, LpEntry> = {
  graduacao: {
    kind: "umbrella",
    slug: "graduacao",
    displayName: "Graduação Florence",
    config: graduacaoConfig,
    cursoOptions: graduacaoOptions,
  },
  "pos-graduacao": {
    kind: "umbrella",
    slug: "pos-graduacao",
    displayName: "Pós Florence",
    config: posConfig,
    cursoOptions: posOptions,
  },
  tecnico: {
    kind: "umbrella",
    slug: "tecnico",
    displayName: "Técnico Florence",
    config: tecnicoConfig,
    cursoOptions: tecnicoOptions,
  },
};

const BY_HOST: Record<string, string> = {
  "graduacao.florence.edu.br": "graduacao",
  "pos.florence.edu.br": "pos-graduacao",
  "tecnico.florence.edu.br": "tecnico",
};

const DEFAULT_SLUG = "graduacao";

/**
 * Resolve which LP to render.
 *
 * Priority:
 *  1. `override` query param (?lp=graduacao|pos-graduacao|tecnico) — for local/preview testing.
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
