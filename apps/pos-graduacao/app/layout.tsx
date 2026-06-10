import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { config } from "@/content/pos-graduacao";

// GTM por env (cada LP pode ter seu container).
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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

        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className="font-sans antialiased bg-white">
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
