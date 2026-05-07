# Variables d’environnement

Référence détaillée des clés : **`.env.example`** (commentaires inline).

---

## Pourquoi mon `.env` local est vide ou incomplet alors que la production marche ?

Cas fréquent sur ce projet : **toutes les variables réelles sont configurées dans Vercel** (Production / Preview). Le fichier **`.env` local n’est plus maintenu** volontairement — vous développez peu ou pas en local et vous itérez via déploiements.

Conséquences à connaître :

| En local sans `.env` complet | Comportement du code |
|-------------------------------|----------------------|
| Pas de `DATABASE_URL` valide | `isDatabaseConfigured()` → faux ; boutique peut afficher des **mock** ; admin « vide » ; auth réelle limitée. |
| Pas de Stripe | Mode démo / mock selon les écrans ; pas de vrai paiement. |
| Pas de Resend | Pas d’envoi d’e-mails réels. |
| Pas de Cloudinary | Upload images formations peut retomber sur **`public/uploads`** (OK en local, pas persistant sur Vercel). |

Ce n’est **pas un bug** : c’est le fonctionnement prévu lorsque l’environnement local n’expose pas les secrets.

Pour retrouver une prod fidèle en local : copier **`.env.example` → `.env`** et y coller les valeurs (ou des équivalents dev) — sans commiter `.env`.

---

## Obligatoire pour un environnement « réel »

| Variable | Usage |
|----------|--------|
| `DATABASE_URL` | PostgreSQL |
| `SESSION_SECRET` | Signature du cookie de session (≥ 32 caractères conseillés) |

Sans ces deux-là, l’app ne peut pas gérer correctement comptes et données persistées.

---

## Souvent requis en production

| Domaine | Variables (voir `.env.example`) |
|---------|-----------------------------------|
| Paiement | `STRIPE_*`, prix récurrents mensuels si cours à la carte |
| E-mails | `RESEND_API_KEY`, `RESEND_FROM` |
| Site public | `NEXT_PUBLIC_SITE_URL` |
| Images | `CLOUDINARY_*` (recommandé sur Vercel) |

---

## Variables « présentes mais peu utilisées »

- **`NEXT_PUBLIC_SUPABASE_*`** : dépendances installées ; l’auth principale du projet est **session maison + Prisma**. Les clés peuvent rester vides tant qu’aucune fonctionnalité Supabase Auth n’est branchée.

---

## Sécurité

- Ne jamais committer **`.env`** (déjà ignoré par git).
- Sur Vercel : limiter l’accès au projet ; faire tourner les Preview avec des secrets dédiés si besoin.
