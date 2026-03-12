import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

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
    <footer className="bg-[#0F2A45] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="font-arabic text-white text-lg font-bold">ع</span>
              </div>
              <span className="font-serif font-bold text-xl">ArabeSimplement</span>
            </div>
            <p
              className="font-arabic text-2xl text-[#B7860B] leading-relaxed"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Une méthode révolutionnaire pour apprendre à lire l&apos;arabe en
              seulement 10 leçons.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-[#B7860B]">
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
            <h3 className="font-serif font-bold text-lg mb-6 text-[#B7860B]">
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
            <h3 className="font-serif font-bold text-lg mb-6 text-[#B7860B]">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-[#B7860B]" />
                <a
                  href="mailto:contact@arabesimplement.fr"
                  className="hover:text-white transition-colors"
                >
                  contact@arabesimplement.fr
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-[#B7860B]" />
                <span>Égypte</span>
              </li>
            </ul>

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
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ArabeSimplement. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
