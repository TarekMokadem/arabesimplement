import { PageHeader } from "@/components/shared/PageHeader";
import { SITE_CONTACT } from "@/lib/site-contact";

export default function MentionsLegalesPage() {
  return (
    <div className="pt-20">
      <PageHeader title="Mentions légales" />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          <h2 className="font-serif text-2xl font-bold text-primary">
            1. Éditeur du site
          </h2>
          <p className="text-gray-600">
            Le site arabesimplement.fr est édité par ArabeSimplement, entreprise individuelle.
          </p>
          <ul className="text-gray-600">
            <li>Responsable de publication : ArabeSimplement</li>
            <li>
              Email :{" "}
              <a
                href={`mailto:${SITE_CONTACT.email}`}
                className="text-secondary hover:underline"
              >
                {SITE_CONTACT.email}
              </a>
            </li>
            <li>Localisation : Égypte</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-primary mt-8">
            2. Hébergement
          </h2>
          <p className="text-gray-600">
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary mt-8">
            3. Propriété intellectuelle
          </h2>
          <p className="text-gray-600">
            L&apos;ensemble du contenu du site (textes, images, vidéos, logos, icônes) est protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary mt-8">
            4. Données personnelles
          </h2>
          <p className="text-gray-600">
            Les données personnelles collectées sur ce site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Pour plus d&apos;informations, consultez notre politique de confidentialité.
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary mt-8">
            5. Cookies
          </h2>
          <p className="text-gray-600">
            Ce site utilise des cookies nécessaires à son bon fonctionnement. En continuant à naviguer sur ce site, vous acceptez l&apos;utilisation de ces cookies.
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary mt-8">
            6. Limitation de responsabilité
          </h2>
          <p className="text-gray-600">
            ArabeSimplement s&apos;efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary mt-8">
            7. Droit applicable
          </h2>
          <p className="text-gray-600">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.
          </p>

          <p className="text-gray-500 mt-12 text-sm">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </section>
    </div>
  );
}
