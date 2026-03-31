/** Coordonnées officielles (affichage + liens). */

export const SITE_CONTACT = {
  email: "arabeen10@gmail.com",
  whatsappHommes: {
    label: "WhatsApp (hommes)",
    display: "+33 6 13 20 45 52",
    href: "https://wa.me/33613204552",
  },
  whatsappFemmes: {
    label: "WhatsApp (femmes)",
    display: "+33 6 29 84 70 42",
    href: "https://wa.me/33629847042",
  },
  telegram: {
    label: "Telegram",
    display: "ArabeSimplement",
    href: "https://t.me/Arabesimplement",
  },
  snapchat: {
    label: "Snapchat",
    display: "arabesimplement",
    /** Lien d'ajout public Snapchat */
    href: "https://www.snapchat.com/add/arabesimplement",
  },
  instagram: {
    label: "Instagram",
    display: "@arabesimplement",
    href: "https://www.instagram.com/arabesimplement/",
  },
  financialAid: {
    title: "Difficulté financière ou besoin d’un accompagnement particulier ?",
    description:
      "Écrivez aux responsables sur WhatsApp : nous étudions chaque situation pour trouver un arrangement adapté à vos cours.",
    whatsappHommesHref:
      "https://wa.me/33613204552?text=" +
      encodeURIComponent(
        "Bonjour, je souhaite échanger sur une aide pour les cours (difficulté financière ou besoin particulier)."
      ),
    whatsappFemmesHref:
      "https://wa.me/33629847042?text=" +
      encodeURIComponent(
        "Bonjour, je souhaite échanger sur une aide pour les cours (difficulté financière ou besoin particulier)."
      ),
  },
} as const;
