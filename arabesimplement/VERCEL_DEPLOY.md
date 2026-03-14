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
Ajoutez ces variables (Settings → Environment Variables) pour que le build fonctionne :

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `DATABASE_URL` | `postgresql://placeholder:placeholder@localhost:5432/placeholder` | Oui (pour Prisma generate) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://placeholder.supabase.co` | Oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `placeholder` | Oui |

> Ces valeurs placeholder permettent au build de passer. Remplacez-les par vos vraies clés quand vous les aurez configurées.

### 4. Déployer
- Cliquez sur **Deploy**
- Le premier déploiement prend 2-3 minutes
- Votre site sera accessible sur `https://arabesimplement-xxx.vercel.app`

### 5. Domaine personnalisé (optionnel)
Dans **Settings** → **Domains**, vous pouvez ajouter un domaine personnalisé.
