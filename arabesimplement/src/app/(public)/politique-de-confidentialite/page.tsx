import { PageHeader } from "@/components/shared/PageHeader";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-20">
      <PageHeader title="Politique de confidentialité" />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
          <p className="text-gray-600 lead">
            La protection de vos données personnelles est une priorité pour ArabeSimplement. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            1. Données collectées
          </h2>
          <p className="text-gray-600">Nous collectons les données suivantes :</p>
          <ul className="text-gray-600">
            <li>Données d&apos;identification : nom, prénom, email, téléphone</li>
            <li>Données de paiement : traitées de manière sécurisée par Stripe</li>
            <li>Données de navigation : cookies techniques et analytiques</li>
            <li>Données de formation : progression, créneaux choisis</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            2. Finalités du traitement
          </h2>
          <p className="text-gray-600">Vos données sont utilisées pour :</p>
          <ul className="text-gray-600">
            <li>Gérer votre compte et vos inscriptions aux formations</li>
            <li>Traiter vos paiements de manière sécurisée</li>
            <li>Vous envoyer des emails relatifs à vos formations</li>
            <li>Améliorer nos services et votre expérience utilisateur</li>
            <li>Répondre à vos demandes de contact</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            3. Base légale
          </h2>
          <p className="text-gray-600">
            Le traitement de vos données repose sur :
          </p>
          <ul className="text-gray-600">
            <li>L&apos;exécution du contrat (inscription aux formations)</li>
            <li>Votre consentement (newsletter, cookies analytiques)</li>
            <li>Notre intérêt légitime (amélioration des services)</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            4. Durée de conservation
          </h2>
          <p className="text-gray-600">
            Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
          </p>
          <ul className="text-gray-600">
            <li>Données de compte : durée de la relation commerciale + 3 ans</li>
            <li>Données de paiement : 10 ans (obligations comptables)</li>
            <li>Données de navigation : 13 mois maximum</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            5. Vos droits
          </h2>
          <p className="text-gray-600">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="text-gray-600">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition</li>
          </ul>
          <p className="text-gray-600">
            Pour exercer ces droits, contactez-nous à : contact@arabesimplement.fr
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            6. Sécurité
          </h2>
          <p className="text-gray-600">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Les paiements sont sécurisés par Stripe (certification PCI-DSS).
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            7. Transferts de données
          </h2>
          <p className="text-gray-600">
            Vos données peuvent être transférées vers des pays hors UE (hébergement Vercel aux USA). Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types).
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mt-8">
            8. Contact
          </h2>
          <p className="text-gray-600">
            Pour toute question concernant cette politique ou vos données personnelles :
          </p>
          <ul className="text-gray-600">
            <li>Email : contact@arabesimplement.fr</li>
          </ul>

          <p className="text-gray-500 mt-12 text-sm">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </section>
    </div>
  );
}
