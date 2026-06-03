import type { Config } from "tailwindcss";
// Preset compartilhado com os tokens da marca Florence (cores, fontes, animacoes).
// eslint-disable-next-line @typescript-eslint/no-var-requires
import florencePreset from "@florence/config/tailwind-preset";

const config: Config = {
  presets: [florencePreset as Partial<Config>],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
export default config;
