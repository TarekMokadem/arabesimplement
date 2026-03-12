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
- **State**: Zustand (panier)
- **Forms**: React Hook Form + Zod

### Structure des routes
```
(public)/       - Pages publiques (accueil, boutique, témoignages, contact)
(shop)/         - Tunnel d'achat (panier, informations, paiement, confirmation)
(auth)/         - Auth (connexion, inscription, tableau de bord apprenant)
admin/          - Admin (à développer)
```

## User Personas

### Apprenant
- Francophone musulman souhaitant apprendre l'arabe
- Souhaite accéder aux formations depuis n'importe quel appareil
- Veut un parcours d'achat simple et rapide

### Professeur (Admin)
- Gère les formations et créneaux
- Consulte les paiements et inscriptions
- Modère les témoignages et messages de contact

## What's Implemented (January 2026)

### MVP Phase 1 ✅
- [x] **Page d'accueil** : Hero, section offres, features, SEO content
- [x] **Boutique** : Liste formations avec filtres, cards interactives
- [x] **Page détail formation** : Infos complètes, créneaux, CTA panier
- [x] **Panier Zustand** : Ajout/suppression, persistance localStorage
- [x] **Tunnel checkout** : 4 étapes (panier, infos, paiement, confirmation)
- [x] **Page informations** : Formulaire avec validation Zod
- [x] **Règlement intérieur** : Checkbox obligatoire avec scroll
- [x] **Auth pages** : Connexion, inscription, mot de passe perdu
- [x] **Tableau de bord apprenant** : Liste formations et infos
- [x] **Page témoignages** : Grille d'avis avec notes
- [x] **Page contact** : Formulaire complet avec FAQ
- [x] **Footer** : Navigation, formations, légal, bismillah
- [x] **Header sticky** : Navigation, panier avec badge, mobile menu

### MOCKED (à connecter avec vraies clés)
- [ ] Supabase Auth (connexion/inscription)
- [ ] Stripe (paiement)
- [ ] Prisma DB (formations en mock data)
- [ ] Resend (emails)

## Prioritized Backlog

### P0 - Critical
- [ ] Connecter Supabase Auth avec vraies clés
- [ ] Intégrer Stripe Elements pour paiement réel
- [ ] Connecter Prisma à la DB Supabase
- [ ] Webhook Stripe pour confirmation paiement
- [ ] Emails de confirmation avec Resend

### P1 - Important  
- [ ] Dashboard Admin complet
- [ ] Gestion des formations (CRUD)
- [ ] Gestion des créneaux
- [ ] Gestion des utilisateurs
- [ ] Gestion des paiements (remboursements)
- [ ] Page choix de créneau avec token

### P2 - Nice to have
- [ ] Blog avec CMS
- [ ] Modération des témoignages
- [ ] Rich text editor (TipTap) pour formations featured
- [ ] Export CSV des données
- [ ] Analytics Vercel
- [ ] Monitoring Sentry

## Next Tasks List
1. Récupérer les credentials Supabase du client
2. Récupérer les clés Stripe (live ou test)
3. Récupérer la clé Resend pour emails
4. Connecter l'authentification Supabase
5. Migrer les données mock vers DB réelle
6. Développer le dashboard admin
