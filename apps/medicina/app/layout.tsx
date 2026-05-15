import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import { config } from "@/content/medicina";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: config.meta.title,
  description: config.meta.description,
  openGraph: {
    title: config.meta.title,
    description: config.meta.description,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <head>
        {/* DNS prefetch + preconnect para o AWS WAF da Vercel (paraleliza handshake) */}
        <link rel="dns-prefetch" href="https://edge.sdk.awswaf.com" />
        <link rel="preconnect" href="https://edge.sdk.awswaf.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
