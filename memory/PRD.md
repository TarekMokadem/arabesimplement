# PRD - ArabeSimplement.fr

## Original Problem Statement
Plateforme d'apprentissage de l'arabe en ligne (arabesimplement.fr) pour un professeur indépendant basé en Égypte. Migration d'un site WordPress/WooCommerce vers une solution custom.

**Objectifs fondamentaux :**
1. Faciliter l'acquisition de clients via un tunnel d'achat ultra-fluide (4 étapes max)
2. Simplifier la gestion du professeur via un tableau de bord admin complet

## Architecture

### Stack Technique
- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL) + Prisma ORM v7
- **Auth**: Supabase Auth (à connecter)
- **Paiements**: Stripe (à connecter)
- **Emails**: Resend (à connecter)
- **State**: Zustand (panier avec hydratation SSR)
- **Forms**: React Hook Form + Zod

### Structure des routes (28 pages)
```
(public)/       - Accueil, Boutique, Cours, Tajwid, Témoignages, Contact, etc.
(shop)/         - Tunnel d'achat (panier, informations, paiement, confirmation)
(auth)/         - Auth (connexion, inscription, tableau de bord apprenant)
admin/          - Dashboard, Formations, Utilisateurs, Paiements, Messages, Témoignages, Paramètres
```

## What's Implemented (January 2026)

### MVP Phase 1 ✅
- [x] **Page d'accueil** : Hero, Session du moment avec countdown, offres, features
- [x] **Session du moment** : Compte à rebours animé, promotion urgente
- [x] **Boutique** : Liste formations avec filtres, cards interactives
- [x] **Page détail formation** : Infos complètes, créneaux, CTA panier
- [x] **Panier Zustand** : Ajout/suppression, persistance localStorage, hook hydratation SSR
- [x] **Tunnel checkout** : 4 étapes (panier, infos, paiement, confirmation)
- [x] **Auth pages** : Connexion, inscription, mot de passe perdu, tableau de bord
- [x] **Pages contenu** : Cours d'arabe, Tajwid, Invocations, Notre parcours
- [x] **Pages légales** : Mentions légales, Politique de confidentialité

### Admin Dashboard ✅
- [x] **Dashboard** : Stats revenus/étudiants, dernières commandes, créneaux avec jauges
- [x] **Formations** : Liste avec images, prix, inscrits, boutons modifier/calendrier
- [x] **Utilisateurs** : Table avec recherche, export CSV
- [x] **Paiements** : Liste avec statuts, filtres, export
- [x] **Messages** : Inbox avec badges nouveau, répondre
- [x] **Témoignages** : Modération approuver/refuser
- [x] **Paramètres** : Config site, emails, règlement intérieur

### MOCKED (à connecter)
- [ ] Supabase Auth
- [ ] Stripe paiement
- [ ] Prisma DB
- [ ] Resend emails

## Next Tasks List
1. Fournir credentials Supabase
2. Fournir clés Stripe
3. Fournir clé Resend
4. Connecter auth et DB
5. Déployer sur Vercel
