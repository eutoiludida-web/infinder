import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INFInder | Inteligência de Ads",
  description: "Inteligência Competitiva de Ads com IA. Descubra, analise e domine o mercado de anúncios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
