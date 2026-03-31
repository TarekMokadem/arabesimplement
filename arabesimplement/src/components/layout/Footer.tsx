import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { FinancialAidCta } from "@/components/shared/FinancialAidCta";
import { SITE_CONTACT } from "@/lib/site-contact";

const footerLinks = {
  navigation: [
    { href: "/", label: "Accueil" },
    { href: "/cours-darabe", label: "Cours d'arabe" },
    { href: "/boutique", label: "Boutique" },
    { href: "/temoignages", label: "Témoignages" },
    { href: "/notre-parcours", label: "Notre Parcours" },
  ],
  formations: [
    { href: "/boutique/lire-en-10-lecons", label: "Lire en 10 leçons" },
    { href: "/boutique/sessions-invocations", label: "Sessions invocations" },
    { href: "/tajwid", label: "Tajwid" },
    { href: "/cours-de-din", label: "Cours de din" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
    { href: "/contactez-nous", label: "Contactez-nous" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BrandLogoMark size={40} />
              <span className="font-serif font-bold text-xl">ArabeSimplement</span>
            </div>
            <p
              className="font-arabic text-2xl text-secondary leading-relaxed"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَانِ الرَّحِيمِ
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cours en ligne, partenariat avec un institut en Égypte, livre
              partagé (niveaux 1 à 11) et pédagogie inspirée des méthodes sur
              place.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-secondary">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Formations */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-secondary">
              Formations
            </h3>
            <ul className="space-y-3">
              {footerLinks.formations.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-secondary">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <a
                  href={`mailto:${SITE_CONTACT.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MessageCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a
                    href={SITE_CONTACT.whatsappHommes.href}
                    className="block hover:text-white transition-colors"
                  >
                    {SITE_CONTACT.whatsappHommes.label} —{" "}
                    {SITE_CONTACT.whatsappHommes.display}
                  </a>
                  <a
                    href={SITE_CONTACT.whatsappFemmes.href}
                    className="block hover:text-white transition-colors"
                  >
                    {SITE_CONTACT.whatsappFemmes.label} —{" "}
                    {SITE_CONTACT.whatsappFemmes.display}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Send className="h-4 w-4 text-secondary shrink-0" />
                <a
                  href={SITE_CONTACT.telegram.href}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONTACT.telegram.display} (Telegram)
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Instagram className="h-4 w-4 text-secondary shrink-0" />
                <a
                  href={SITE_CONTACT.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONTACT.instagram.display}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <span className="h-4 w-4 text-secondary shrink-0 text-center text-xs font-bold">
                  S
                </span>
                <a
                  href={SITE_CONTACT.snapchat.href}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONTACT.snapchat.display} (Snapchat)
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-secondary shrink-0" />
                <span>Partenaire — Égypte</span>
              </li>
            </ul>

            <div className="mt-8">
              <FinancialAidCta tone="dark" />
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium mb-4">Légal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-gray-300 transition-colors duration-200 text-xs"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/15 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ArabeSimplement. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
