import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SITE_CONTACT } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Conditions générales de vente (CGV)",
  description:
    "Conditions générales de vente des formations et services ArabeSimplement — paiement, accès, rétractation, litiges.",
};

export default function ConditionsGeneralesDeVentePage() {
  return (
    <div className="pt-20">
      <PageHeader title="Conditions générales de vente (CGV)" />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary">
          <p className="text-gray-600 not-prose text-sm border-l-4 border-secondary/40 pl-4 mb-10">
            Les présentes CGV régissent les ventes conclues sur le site{" "}
            <strong>arabesimplement.fr</strong> entre ArabeSimplement
            («&nbsp;le vendeur&nbsp;») et toute personne physique consommatrice
            («&nbsp;le client&nbsp;»). Toute commande implique l&apos;acceptation pleine
            et entière des présentes conditions, sans réserve. Elles prévalent sur
            toute autre version ou document contradictoire.
          </p>

          <h2>1. Mentions légales du vendeur</h2>
          <p className="text-gray-600">
            Le site est édité par <strong>ArabeSimplement</strong>, entreprise
            individuelle. Contact :{" "}
            <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>.
            Les mentions légales détaillées (hébergement, propriété
            intellectuelle, etc.) figurent sur la page{" "}
            <Link href="/mentions-legales">Mentions légales</Link>.
          </p>

          <h2>2. Champ d&apos;application</h2>
          <p className="text-gray-600">
            Les présentes CGV s&apos;appliquent à la vente de formations et
            prestations pédagogiques proposées à distance (cours en ligne,
            accès à des contenus ou créneaux, abonnements récurrents le cas
            échéant), exclusivement aux clients agissant en qualité de
            consommateurs au sens du Code de la consommation.
          </p>

          <h2>3. Produits, disponibilité et descriptifs</h2>
          <p className="text-gray-600">
            Les offres sont présentées sur la boutique du site avec les
            caractéristiques essentielles (titre, modalités, prix, créneaux ou
            options le cas échéant). Les photographies ou illustrations n&apos;ont
            pas de valeur contractuelle. Le vendeur peut retirer une offre ou en
            limiter la disponibilité tant que la commande n&apos;a pas été
            définitivement validée et payée.
          </p>

          <h2>4. Prix</h2>
          <p className="text-gray-600">
            Les prix sont indiqués en <strong>e euros (€) toutes taxes
            comprises</strong> applicables au jour de la commande. Le vendeur se
            réserve le droit de modifier ses tarifs ; le prix facturé est celui
            affiché au moment de la validation du panier par le client.
          </p>

          <h2>5. Commande et conclusion du contrat</h2>
          <p className="text-gray-600">
            La commande s&apos;effectue via le tunnel prévu sur le site
            (panier, informations, paiement). Le contrat est réputé conclu à
            réception par le vendeur de l&apos;acceptation du paiement ou, en cas
            de paiement différé ou d&apos;abonnement, à la validation de la commande
            selon les moyens proposés. Le vendeur accuse réception de la commande
            par tout moyen approprié (notamment e-mail ou espace client).
          </p>
          <p className="text-gray-600">
            Le client déclare avoir la pleine capacité juridique pour contracter
            et fournir des informations exactes (identité, coordonnées).
          </p>

          <h2>6. Paiement</h2>
          <p className="text-gray-600">
            Le paiement est exigible en totalité au moment de la commande, sauf
            mention contraire (ex. abonnement avec premier prélèvement à
            l&apos;engagement). Les paiements par carte bancaire ou moyens
            proposés via <strong>Stripe</strong> sont sécurisés ; le vendeur ne
            conserve pas les coordonnées bancaires complètes du client. En cas de
            refus de paiement par l&apos;organisme bancaire, la commande est
            annulée.
          </p>

          <h2>7. Exécution et accès aux prestations</h2>
          <p className="text-gray-600">
            Après confirmation du paiement, le client reçoit les instructions
            nécessaires pour accéder à la ou aux formations (compte, lien
            d&apos;accès, créneau, groupe de messagerie, etc.) dans les délais
            habituellement affichés sur le site ou communiqués par e-mail. Pour
            les abonnements, l&apos;accès et la facturation suivent les modalités
            décrites sur la fiche produit et dans l&apos;espace client.
          </p>
          <p className="text-gray-600">
            Le client s&apos;engage à respecter le{" "}
            <Link href="/commande/informations">règlement intérieur</Link> et les
            consignes pédagogiques communiquées par le vendeur.
          </p>

          <h2>8. Droit de rétractation</h2>
          <p className="text-gray-600">
            Conformément aux articles L. 221-18 et suivants du Code de la
            consommation, le client dispose d&apos;un{" "}
            <strong>délai de quatorze (14) jours</strong> à compter de la
            conclusion du contrat pour exercer son droit de rétractation, sans
            motif ni pénalité. Pour l&apos;exercer, le client adresse au vendeur,
            avant l&apos;expiration du délai, une déclaration dénuée d&apos;ambiguïté
            (par exemple par e-mail à{" "}
            <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>)
            exprimant sa volonté de se rétracter.
          </p>
          <p className="text-gray-600">
            Pour les contenus numériques non fournis sur un support matériel et
            pour lesquels l&apos;exécution a commencé avec l&apos;accord préalable
            exprès du client et renonciation expresse au droit de rétractation
            le cas échéant, des exceptions prévues par la loi peuvent s&apos;appliquer.
            Le client est informé de ces hypothèses sur la fiche produit ou au
            moment de la commande lorsque la loi l&apos;impose.
          </p>
          <p className="text-gray-600">
            En cas de rétractation valable, le vendeur rembourse tous les
            paiements reçus dans un délai de quatorze (14) jours à compter de la
            notification de la rétractation, avec le même moyen de paiement que
            celui utilisé par le client, sauf accord exprès pour un autre moyen.
          </p>

          <h2>9. Garanties légales</h2>
          <p className="text-gray-600">
            Le client bénéficie de la garantie légale de conformité et, le cas
            échéant, de la garantie des vices cachés, conformément aux articles
            L. 217-3 et suivants et 1641 et suivants du Code civil.
          </p>

          <h2>10. Limitation de responsabilité</h2>
          <p className="text-gray-600">
            Le vendeur est tenu d&apos;une obligation de moyens pour la fourniture
            des prestations. La responsabilité du vendeur ne saurait être
            engagée en cas de force majeure ou de fait imputable au client ou à
            un tiers au contrat. L&apos;indemnisation éventuelle est limitée au
            montant payé par le client pour la commande concernée, sauf faute
            lourde ou dol et dans les limites fixées par la loi.
          </p>

          <h2>11. Données personnelles</h2>
          <p className="text-gray-600">
            Les données collectées sont traitées conformément au RGPD. Pour le
            détail des traitements, droits et contacts, le client se réfère à
            la{" "}
            <Link href="/politique-de-confidentialite">
              Politique de confidentialité
            </Link>
            .
          </p>

          <h2>12. Réclamations et règlement des litiges</h2>
          <p className="text-gray-600">
            Pour toute réclamation, le client contacte en priorité le vendeur à
            l&apos;adresse{" "}
            <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>.
            Conformément aux articles L. 612-1 et suivants du Code de la
            consommation, le client a la possibilité de recourir gratuitement
            à un médiateur de la consommation en vue de la résolution amiable
            du litige. Informations et saisine : plateforme officielle des
            médiateurs de la consommation sur le site{" "}
            <a
              href="https://www.economie.gouv.fr/mediation-conso"
              target="_blank"
              rel="noopener noreferrer"
            >
              economie.gouv.fr/mediation-conso
            </a>
            . Le client peut également utiliser la plateforme européenne de
            règlement en ligne des litiges :{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>

          <h2>13. Droit applicable</h2>
          <p className="text-gray-600">
            Les présentes CGV sont soumises au <strong>droit français</strong>.
            En l&apos;absence de règlement amiable, compétence attribuée aux
            tribunaux français, conformément aux règles de compétence
            matérielle et territoriale en vigueur.
          </p>

          <h2>14. Modifications</h2>
          <p className="text-gray-600">
            Le vendeur peut mettre à jour les CGV ; la version applicable est
            celle acceptée par le client au moment de chaque commande. La
            version en vigueur est toujours accessible sur cette page.
          </p>

          <p className="text-gray-500 mt-12 text-sm not-prose">
            Dernière mise à jour : avril 2026
          </p>
        </div>
      </section>
    </div>
  );
}
