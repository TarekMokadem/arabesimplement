export type PublicFaqEntry = {
  q: string;
  a: string;
  href?: string;
  cta?: string;
};

/** Questions affichées sur la page FAQ complète (les 3 premières sont reprises sur l’accueil). */
export const PUBLIC_FAQ_ENTRIES: PublicFaqEntry[] = [
  {
    q: "Par où commencer si je ne sais pas quelle formation choisir ?",
    a: "La page « Par où commencer » vous oriente selon votre objectif (lire le Coran, débuter, renforcer la lecture, etc.).",
    href: "/par-ou-commencer",
    cta: "Voir le guide",
  },
  {
    q: "Que se passe-t-il après le paiement ?",
    a: "Vous accédez à votre espace apprenant, aux créneaux ou contacts prévus par la formation, et à WhatsApp selon votre profil — le tout est détaillé étape par étape.",
    href: "/comment-ca-marche",
    cta: "Comment ça marche",
  },
  {
    q: "Les cours sont-ils en ligne uniquement ?",
    a: "Oui : inscription et organisation via le site ; les séances se font en visio avec nos enseignants, selon le mode indiqué sur chaque fiche formation.",
    href: "/boutique",
    cta: "Voir la boutique",
  },
  {
    q: "Faut-il savoir l’arabe avant de s’inscrire ?",
    a: "Non pour les parcours débutants : nous partons des bases (lettres, lecture). Les fiches formation indiquent le niveau attendu lorsque ce n’est pas un public débutant.",
    href: "/cours-darabe",
    cta: "Cours d’arabe",
  },
  {
    q: "Comment contacter l’équipe en cas de souci technique ou administratif ?",
    a: "Utilisez la page contact : nous vous répondons dès que possible. Les élèves ont aussi des moyens de contact selon la formation (notamment WhatsApp après achat).",
    href: "/contactez-nous",
    cta: "Contact",
  },
  {
    q: "Les groupes « invocations » hommes et femmes sont-ils séparés ?",
    a: "Oui : les sessions invocations matin et soir sont organisées dans des groupes distincts pour respecter un cadre adapté à chacun.",
    href: "/boutique/sessions-invocations",
    cta: "Sessions invocations",
  },
];

export const HOME_FAQ_TEASER_ITEMS = PUBLIC_FAQ_ENTRIES.slice(0, 3);
