# ArabeSimplement — application web

Site vitrine, boutique en ligne (formations), tunnel de commande, espace élève et administration — stack **Next.js** (App Router).

## En deux phrases

- **Front / SSR / API routes :** Next.js 16, React 19, TypeScript, Tailwind.
- **Données :** PostgreSQL via **Prisma** ; paiements **Stripe** ; e-mails **Resend** ; images formations **Cloudinary** (ou fichiers locaux en secours).

Pour la structure du code et les dossiers importants, voir **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## Prérequis

- Node.js 20+ (recommandé)
- npm

---

## Démarrage local

```bash
cd arabesimplement
npm install
cp .env.example .env
```

Renseigner au minimum **`DATABASE_URL`** et **`SESSION_SECRET`** dans `.env` pour tester avec une vraie base (voir [docs/ENVIRONNEMENT.md](docs/ENVIRONNEMENT.md)).

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

### Scripts utiles

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production (comme CI / Vercel) |
| `npm run lint` | ESLint |
| `npm run db:dev` | Crée une migration Prisma (dev) |
| `npm run db:migrate` | Applique les migrations (`migrate deploy`, prod / CI) |
| `npm run db:seed` | Données de démo + compte admin (voir seed) |

---

## Déploiement

Résumé : dépôt GitHub relié à **Vercel**, variables d’environnement sur le tableau de bord Vercel.

Détails : **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)**

---

## Variables d’environnement

Liste commentée : **`.env.example`**

Pourquoi ton `.env` local peut être vide alors que la prod fonctionne : **[docs/ENVIRONNEMENT.md](docs/ENVIRONNEMENT.md)**

---

## Documentation développeur

| Fichier | Contenu |
|---------|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Organisation du repo, routes, couches (`lib`, `actions`, composants) |
| [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md) | Vercel, base de données, Stripe webhook |
| [docs/ENVIRONNEMENT.md](docs/ENVIRONNEMENT.md) | Variables d’env, comportement sans DB / sans Stripe |

---

## Choix techniques (résumé)

- **App Router + Server Components** par défaut : données sensibles et appels Prisma côté serveur ; petits îlots **client** (`"use client"`) pour panier, formulaires interactifs, Stripe Elements.
- **Auth « maison »** : cookie session signé (Jose), utilisateurs en base — pas NextAuth ; dépendance **Supabase** présente pour usages futurs / SSR, ce n’est pas le fournisseur principal des sessions actuelles.
- **Prisma** : schéma unique dans `prisma/schema.prisma`, migrations versionnées.
- **Paiement :** Stripe (carte / flux abonnement cours à la carte) ; **PayPal.me** en lien manuel configurable (`site_config`), hors Checkout PayPal intégré.
- **E-mails :** Resend (transactionnels).
- **Images formations :** Cloudinary en prod si les clés sont présentes ; sinon écriture sous `public/uploads/formations` (adapté au serveur local, pas idéal sur Vercel sans volume persistant).

Plus de détail dans **ARCHITECTURE.md** et **DEPLOIEMENT.md**.

---

## Licence / propriété

Projet privé (`"private": true` dans `package.json`). Ajuster selon la politique du projet.
