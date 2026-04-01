import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INFInder | Inteligencia de Ads",
  description: "Inteligencia Competitiva de Ads com IA. Descubra, analise e domine o mercado de anuncios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
