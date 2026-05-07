# Déploiement

## Chaîne actuelle (typique)

1. Code poussé sur **GitHub** (`main`).
2. **Vercel** est relié au dépôt : chaque push déclenche un build (`npm run build`, cf. `vercel.json`).
3. Les **secrets** (DB, Stripe, etc.) sont définis dans **Vercel → Project → Settings → Environment Variables** (Production / Preview selon les besoins).

Il n’y a pas de fichier CI GitHub Actions obligatoire dans ce repo : **Vercel fait office de pipeline**.

---

## Base de données

- PostgreSQL hébergé (Neon, Supabase, RDS, etc.) : URL dans **`DATABASE_URL`** sur Vercel.
- **Migrations Prisma** : à appliquer sur la base pointée par cette URL.

Le script **`npm run db:migrate`** exécute `prisma migrate deploy`. À lancer :

- en local avec la même `DATABASE_URL` que la prod, ou  
- via une étape CI dédiée, ou  
- manuellement depuis une machine de confiance après déploiement,

selon la façon dont l’équipe travaille. **Ce projet ne lance pas automatiquement les migrations dans `npm run build`** — surveiller les nouvelles migrations avant/après mise en ligne.

Le seed (**`npm run db:seed`**) est pour dev / recréation d’environnement, pas pour chaque déploiement prod automatique.

---

## Stripe

- Clés API dans les variables d’environnement Vercel (`STRIPE_*`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
- **Webhook** : URL du type `https://www.<domaine>/api/webhooks/stripe`, secret **`STRIPE_WEBHOOK_SECRET`** aligné sur l’endpoint du dashboard Stripe.

Sans webhook ou avec secret incorrect, les commandes peuvent rester **en attente** jusqu’à une synchro manuelle ou une action serveur prévue dans le code.

---

## Domaine et URLs canoniques

- **`NEXT_PUBLIC_SITE_URL`** sur Vercel doit refléter le domaine public (ex. `https://www.arabesimplement.fr`) pour Open Graph, certains liens e-mail et cohérence générale.

---

## Preview deployments

Les déploiements « Preview » Vercel peuvent utiliser une **base différente** ou les mêmes variables selon la configuration. À clarifier en équipe pour éviter de pointer une Preview vers la prod DB par erreur.
