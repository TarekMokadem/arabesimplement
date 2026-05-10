# Architecture du code

Objectif : situer rapidement où modifier quoi, sans tout réécrire.

## Arborescence `src/app/` (Next.js App Router)

Les **groupes de routes** `(nom)` n’apparaissent pas dans l’URL ; ils servent à organiser layouts et pages.

| Groupe | Rôle |
|--------|------|
| **`app/(public)/`** | Pages publiques : accueil, pages « cours », boutique (`/boutique`, `/boutique/[slug]`), contenus légaux, FAQ, etc. |
| **`app/(shop)/`** | Tunnel achat : panier, infos livraison/facturation, paiement, confirmation — layout avec header minimal. |
| **`app/(auth)/`** | Connexion, inscription, tableau de bord élève, historique d’achats — zones protégées par middleware (session). |
| **`app/admin/`** | Back-office (rôle `ADMIN`). Layout commun + **`dynamic = "force-dynamic"`** pour éviter du cache obsolète sur les stats. |
| **`app/api/`** | Routes API : upload image formations (admin), webhook Stripe. |

Fichiers racine utiles :

- **`middleware.ts`** : redirection si non connecté sur `/admin/*`, `/tableau-de-bord`, `/historique-achats`.
- **`app/layout.tsx`** : layout global du site.

---

## Couche données et métier (`src/lib/`)

Convention grossière :

- **`lib/data/*.service.ts`** — Lecture / agrégations via Prisma (boutique, admin, commandes en lecture, témoignages…).
- **`lib/orders/`**, **`lib/stripe/`**, **`lib/auth/`** — Règles métier (création commande, webhooks, session).
- **`lib/prisma.ts`** — Client Prisma singleton.
- **`lib/utils/`** — Utilitaires (dont `database.ts` : `isDatabaseConfigured()` selon `DATABASE_URL`).
- **`lib/validations/`** — Schémas Zod pour formulaires / server actions.

Si **`DATABASE_URL`** est absente ou placeholder, beaucoup de services retournent **tableaux vides** ou données **mock** (ex. boutique) — comportement voulu pour démo sans Postgres.

---

## Actions serveur et mutations

- **`app/(shop)/actions/`**, **`app/(auth)/actions/`**, **`app/admin/**/actions.ts`** — Fonctions marquées **`"use server"`** : création commande, marquage payé, CRUD admin, etc.

Gardez la logique métier lourde dans **`lib/`** et les actions comme **orchestration fine** (validation → appel service → `revalidatePath` si besoin).

---

## Composants (`src/components/`)

- **`components/ui/`** — Primitives style shadcn (Button, Card, etc.).
- **`components/shop/`** — Panier, checkout, fiches produit, synchro paiement confirmation.
- **`components/admin/`** — Cartes stats, jauges, sidebar admin.

---

## Paiements : Stripe vs PayPal.me

- **Stripe** (carte / abonnement) : le serveur et les webhooks peuvent passer la commande en **payée** automatiquement (`PAID`).
- **PayPal.me** (`PaypalMeCheckoutBlock`) : simple lien vers un profil PayPal — **aucun webhook** n’informe l’application qu’un paiement a été reçu. La commande reste **`PENDING`** jusqu’à validation manuelle dans l’admin (**Marquer comme payé**), sauf si l’équipe impose une autre procédure.

Sur la page paiement, un bouton permet à l’acheteur d’ouvrir la **page de confirmation** après avoir payé sur PayPal : le récapitulatif affiche alors le statut **en attente** jusqu’à traitement admin.

Pour une confirmation PayPal **entièrement automatique**, il faudrait intégrer l’API PayPal (Checkout / webhooks), hors périmètre actuel du lien PayPal.me.

---

## Contenu marketing / liens boutique

Les URLs **`/boutique/[slug]`** utilisées dans le footer, « Cours d’arabe », « Par où commencer », etc. sont centralisées dans **`src/lib/content/marketing-boutique-links.ts`**. À mettre à jour si le slug d’une formation change en admin (sinon 404).

---

## Schéma base de données

Un seul fichier source : **`prisma/schema.prisma`**.

Entités centrales : `User`, `Formation`, `Creneau`, `Order`, `OrderItem`, `Enrollment`, `CourseWeeklySubscription` (abonnement cours à la carte mensuel), `SiteConfig`, `Testimonial`, `ContactMessage`, etc.

Après modification du schéma :

```bash
npm run db:dev      # dev : nouvelle migration
npm run db:migrate  # prod/CI : appliquer migrations existantes
```

---

## Fichiers config notables

| Fichier | Rôle |
|---------|------|
| `next.config.ts` | Images distantes autorisées, en-têtes CSP |
| `vercel.json` | Commande de build Vercel (`npm run build`) |
| `eslint.config.mjs` | Règles ESLint |

Pour les images de fiches formation : logique **`FormationCoverImage`** + liste alignée avec `images.remotePatterns` dans `next.config.ts` (voir historique git si besoin).
