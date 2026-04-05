import type { Metadata } from "next";
import { Libre_Baskerville, Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";

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

const siteUrl = getSiteUrl();
const defaultOgImage = toAbsoluteUrl("/brand/logo-arabe-simplement.png");

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
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
    url: siteUrl || undefined,
    images:
      defaultOgImage && defaultOgImage.startsWith("http")
        ? [
            {
              url: defaultOgImage,
              width: 512,
              height: 512,
              alt: "ArabeSimplement",
            },
          ]
        : undefined,
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
