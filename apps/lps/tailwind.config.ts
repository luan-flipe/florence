import type { Config } from "tailwindcss";
import florencePreset from "../../packages/config/tailwind-preset.js";

const config: Config = {
  presets: [florencePreset as Partial<Config>],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/umbrella/**/*.{js,ts,jsx,tsx}",
  ],
};
export default config;
