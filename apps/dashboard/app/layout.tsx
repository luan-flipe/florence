import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Florence",
  description: "Gestão de leads do Centro Universitário Florence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <NextTopLoader
          color="#0072a3"
          showSpinner={false}
          height={2}
          shadow="0 0 8px #0072a3, 0 0 4px #0072a3"
          easing="cubic-bezier(0.32, 0.72, 0, 1)"
          speed={250}
        />
        {children}
      </body>
    </html>
  );
}
