import type { Config } from "tailwindcss";
// Preset compartilhado com os tokens da marca Florence (cores, fontes, animacoes).
// eslint-disable-next-line @typescript-eslint/no-var-requires
import florencePreset from "../../packages/config/tailwind-preset.js";

const config: Config = {
  presets: [florencePreset as Partial<Config>],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Componentes compartilhados (senao classes Tailwind deles sao purgadas)
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
};
export default config;
