import type { Metadata } from "next";
import { Libre_Baskerville, Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ArabeSimplement - Apprendre l'arabe facilement",
    template: "%s | ArabeSimplement",
  },
  description:
    "Cours d'arabe en ligne : partenariat avec un institut en Égypte, méthodes et supports (livre niveaux 1 à 11), formations et accompagnement pour francophones.",
  keywords: [
    "apprendre arabe",
    "cours arabe en ligne",
    "lire arabe",
    "alphabet arabe",
    "formation arabe",
    "tajwid",
  ],
  authors: [{ name: "ArabeSimplement" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ArabeSimplement",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${libreBaskerville.variable} ${inter.variable} ${amiri.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
