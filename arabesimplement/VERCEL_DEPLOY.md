# Déploiement sur Vercel - ArabeSimplement

## Étapes de configuration

### 1. Créer un compte Vercel
- Rendez-vous sur [vercel.com](https://vercel.com)
- Connectez-vous avec votre compte GitHub

### 2. Importer le projet
1. Cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez le dépôt **TarekMokadem/arabesimplement**
3. **Important** : Dans **Root Directory**, cliquez sur **Edit** et saisissez : `arabesimplement`
4. Cliquez sur **Continue**

### 3. Variables d'environnement
Dans **Settings → Environment Variables**, ajoutez au minimum :

| Variable | Rôle | Build Vercel |
|----------|------|--------------|
| `DATABASE_URL` | PostgreSQL (Prisma) | Placeholder possible pour `prisma generate` ; mettez l’URL réelle pour la prod. |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth Supabase (futur) | Placeholder accepté si non utilisé. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Idem | Placeholder accepté. |
| `STRIPE_SECRET_KEY` | Paiements | Optionnel jusqu’à activation Stripe. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Paiements côté client | Optionnel. |
| `STRIPE_WEBHOOK_SECRET` | Webhook `/api/webhooks/stripe` | Optionnel. |

Référence locale : copier `.env.example` vers `.env` dans `arabesimplement/` et remplir.

> Des valeurs placeholder (comme dans `.env.example`) permettent souvent au **build** de passer ; sans base réelle, le site utilise les mocks catalogue / commande.

### 4. Déployer
- Cliquez sur **Deploy**
- Le premier déploiement prend 2-3 minutes
- Votre site sera accessible sur `https://arabesimplement-xxx.vercel.app`

### 5. Domaine personnalisé (optionnel)
Dans **Settings** → **Domains**, vous pouvez ajouter un domaine personnalisé.
