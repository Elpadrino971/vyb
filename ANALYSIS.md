# Analyse Complète du Repo Vybzzz

**Date:** 2026-01-28
**Repo:** https://github.com/Elpadrino971/rork-vybzzz-concert-platform

---

## 1. Vue d'Ensemble

**Vybzzz** est une plateforme de streaming de concerts en direct, développée en **React Native + Expo** avec TypeScript. Le concept: permettre aux artistes de diffuser leurs concerts en live et aux fans d'acheter des billets électroniques pour les regarder depuis n'importe où dans le monde.

**Slogan:** *"Achète ton billet, regarde le concert en direct depuis n'importe où dans le monde"*

**Version:** 1.0.0 (MVP - Phase 1)

---

## 2. Stack Technique

| Couche | Technologie | Version |
|--------|------------|---------|
| **Framework** | React Native + Expo | 0.81.5 / 54.0.31 |
| **Langage** | TypeScript (strict mode) | 5.9.2 |
| **Navigation** | React Navigation | 7.10.1 |
| **State Management** | Zustand (installé, pas encore implémenté) | 5.0.10 |
| **Data Fetching** | TanStack React Query (installé, pas encore intégré) | 5.90.19 |
| **Base de données** | Supabase (PostgreSQL) | 2.91.0 |
| **Paiements** | Stripe React Native | 0.57.3 |
| **Streaming vidéo** | Mux (HLS) + expo-av | 16.0.8 |
| **Internationalisation** | i18next + react-i18next | 25.8.0 / 16.5.3 |
| **UI** | expo-linear-gradient, StyleSheet | - |

---

## 3. Architecture du Projet

```
vyb/
├── src/
│   ├── screens/              # 10 écrans
│   │   ├── home/            # HomeScreen - Feed de concerts
│   │   ├── explore/         # ExploreScreen - Découverte par genre
│   │   ├── live/            # LiveScreen - Concerts en direct (placeholder)
│   │   ├── tickets/         # TicketsScreen - E-billets (placeholder)
│   │   ├── profile/         # ProfileScreen - Paramètres utilisateur
│   │   ├── concert/         # ConcertDetailScreen - Détail + lecteur Mux
│   │   ├── payment/         # TicketCheckoutScreen - Paiement Stripe
│   │   ├── artist/          # ArtistDashboardScreen - Analytics revenus
│   │   ├── auth/            # BecomeProScreen - Abonnement Pro/Founder
│   │   └── search/          # SearchScreen (placeholder)
│   ├── components/           # Composants réutilisables
│   │   ├── navigation/      # CapsuleNavBar (barre de nav custom)
│   │   ├── home/            # ConcertCard (carte de concert)
│   │   └── live/            # MuxPlayer (lecteur vidéo HLS)
│   ├── services/             # Intégrations backend
│   │   ├── supabase.ts      # Base de données + Auth
│   │   ├── stripe.ts        # Paiements + Abonnements
│   │   └── mux.ts           # Streaming vidéo live/VOD
│   ├── hooks/                # Hooks personnalisés
│   │   └── useTheme.tsx     # Système de thèmes (light/dark/auto)
│   ├── constants/            # Design System
│   │   ├── colors.ts        # Palette de couleurs
│   │   ├── typography.ts    # Typographie
│   │   ├── layout.ts        # Espacement, dimensions
│   │   └── theme.ts         # Composition du thème
│   └── navigation/           # Configuration navigation
│       └── MainNavigator.tsx # Tab Navigator avec 5 onglets
├── App.tsx                   # Composant racine
├── index.ts                  # Point d'entrée (registerRootComponent)
├── app.config.js             # Configuration Expo dynamique
├── package.json              # 33 dépendances de production
├── tsconfig.json             # TypeScript strict + alias de chemins
├── .env.example              # Template variables d'environnement
├── STRIPE_CONFIGURATION.md   # Guide de config Stripe
├── STRIPE_PRODUCTS_SETUP.ts  # Code de setup produits Stripe
└── README.md                 # Documentation complète
```

---

## 4. Fonctionnalités Implémentées

### 4.1 Streaming de Concerts en Direct
- Intégration **Mux** pour le streaming HLS adaptatif
- Composant `MuxPlayer` avec contrôles play/pause
- Support live + VOD (Video On Demand)
- Génération de thumbnails depuis les streams
- Indicateur de direct avec nombre de viewers

### 4.2 Système de Billetterie
- Intégration **Stripe** pour le paiement
- Flow complet: sélection → checkout → confirmation
- E-billets avec QR codes (schéma DB prêt)
- Écran `TicketCheckoutScreen` fonctionnel

### 4.3 Modèle de Revenus (70/30)
- **70% pour l'artiste** / 30% pour la plateforme
- Dashboard artiste avec analytics de revenus
- Calcul automatique des payouts via `calculateArtistPayout()`
- Stripe Connect pour les virements artistes

### 4.4 Monétisation Artiste
| Produit | Prix | Type | Limite |
|---------|------|------|--------|
| **Pro Subscription** | 59€/mois | Récurrent | Illimité |
| **Founder Badge** | 59€ unique | One-time | 50 artistes max |

**Fonctionnalités Pro:**
- Concerts illimités, streaming HD
- Analytics avancés, support prioritaire

**Fonctionnalités Founder:**
- Tout Pro + badge vérifié
- Accès premium à vie, analytics premium

### 4.5 Découverte de Concerts
- Feed principal avec sections "En direct" et "À venir"
- Navigation par genre (R&B, Hip-Hop, Pop, Rock, Jazz, Electronic)
- Section "Top artistes" avec compteurs de followers
- Écran Explore dédié

### 4.6 Système de Thèmes
- **Mode clair**: fond blanc, accents dorés (#D4AF37)
- **Mode sombre**: fond noir, accents rouges (#E50914, style Netflix)
- Détection automatique du thème système
- Basculement manuel dans les paramètres

### 4.7 Internationalisation (i18n)
8 langues supportées dès le lancement:
- Français (défaut), English, Español, Português
- 한국어, 中文, Deutsch, 日本語

---

## 5. Schéma de Base de Données (Supabase)

```
profiles
├── id (UUID, PK)
├── email, full_name, avatar_url
├── role: 'fan' | 'artist' | 'admin'
└── created_at, updated_at

artists
├── user_id (FK → profiles)
├── artist_name, bio, genre
├── avatar_url, banner_url
├── followers_count, is_verified, is_founder
├── stripe_account_id
├── revenue_split: 70
└── created_at, updated_at

concerts
├── id (UUID, PK)
├── artist_id (FK → artists)
├── title, description, genre
├── scheduled_at, duration_minutes
├── price, currency
├── status: 'scheduled' | 'live' | 'ended' | 'cancelled'
├── mux_playback_id, mux_stream_key
├── is_live, thumbnail_url
├── viewers_count, total_revenue
└── created_at, updated_at

tickets
├── id (UUID, PK)
├── concert_id (FK), user_id (FK)
├── stripe_payment_intent_id
├── price_paid, currency
├── status: 'pending' | 'paid' | 'refunded'
├── qr_code
└── created_at

artist_payouts
├── id (UUID, PK)
├── artist_id (FK), concert_id (FK)
├── amount, currency
├── revenue_split_percentage
├── stripe_payout_id
├── status: 'pending' | 'processing' | 'paid' | 'failed'
└── period_start, period_end
```

---

## 6. Design System

### Couleurs
- **Or (Gold):** #D4AF37 - couleur d'accent principale
- **Rouge (Red):** #E50914 - accent mode sombre (style Netflix)
- **Dégradé principal:** Gold → Red

### Typographie
- Police système (Inter-like)
- Échelle: 12px (xs) → 80px (7xl)
- Styles prédéfinis: h1-h6, body, caption, button, label

### Layout
- Grille de base 4px (xs=4, sm=8, md=12, base=16...)
- Barre de nav: 80px de hauteur, bouton LIVE central de 60px
- Cards: 280x160px (concert), 160x220px (vertical)

---

## 7. Variables d'Environnement Requises

```bash
EXPO_PUBLIC_SUPABASE_URL          # URL Supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY     # Clé anonyme Supabase
EXPO_PUBLIC_MUX_TOKEN_ID          # Token ID Mux
EXPO_PUBLIC_MUX_TOKEN_SECRET      # Secret Mux
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY # Clé publique Stripe
EXPO_PUBLIC_APP_ENV               # Environnement (development/production)
EXPO_PUBLIC_RORK_API_BASE_URL     # URL API backend
EXPO_PUBLIC_ENABLE_ANALYTICS      # Flag analytics
EXPO_PUBLIC_ENABLE_CRASHLYTICS    # Flag crashlytics
```

---

## 8. Points Forts

1. **Architecture propre** - Séparation claire des responsabilités (screens, components, services, hooks, constants)
2. **TypeScript strict** - Typage fort avec mode strict activé
3. **Design System complet** - Couleurs, typographie, layout, thèmes bien structurés
4. **Intégrations de qualité** - Stripe, Supabase et Mux correctement configurés
5. **Path aliases** - Imports propres avec `@/` préfixes
6. **Multi-langue** - 8 langues supportées dès le MVP
7. **Modèle économique clair** - Revenue split 70/30 favorable aux artistes
8. **Navigation custom** - CapsuleNavBar avec design glossy unique

---

## 9. Points d'Amélioration / Éléments Manquants

### Critique (bloquant pour la production)
1. **Pas de serveur backend** - Les fonctions Stripe/Mux appellent des endpoints API qui n'existent pas encore (`/api/payments/`, `/api/mux/`, `/api/webhooks/`)
2. **Pas de migrations Supabase** - Le schéma DB est défini en TypeScript mais pas en SQL
3. **Produits Stripe non créés** - Les `priceId` sont des placeholders (`price_vybzzz_pro_monthly`)
4. **Pas de CI/CD** - Aucun pipeline GitHub Actions

### Important (fonctionnel mais incomplet)
5. **Zustand non implémenté** - Installé mais aucun store créé
6. **TanStack Query non intégré** - Installé mais pas utilisé
7. **Dossier `types/`** non créé - Types définis dans les services au lieu d'un dossier dédié
8. **Dossier `store/`** non créé - Référencé dans tsconfig mais vide
9. **Dossier `utils/`** non créé - Aucune fonction utilitaire
10. **Écrans placeholders** - LiveScreen, TicketsScreen, SearchScreen sont des squelettes

### Recommandé
11. **Tests absents** - Aucun test unitaire ou d'intégration
12. **Gestion d'erreurs** - Minimale sur les appels API
13. **Authentification** - Le flow de connexion/inscription n'est pas implémenté côté UI
14. **Notifications push** - Prévu dans la roadmap Phase 3
15. **Traductions incomplètes** - Infrastructure i18n en place, contenu non traduit

---

## 10. Statut d'Implémentation

| Phase | Statut | Description |
|-------|--------|-------------|
| **Phase 1 - MVP UI** | ✅ Terminé | Structure projet, navigation, design system, écrans principaux |
| **Phase 2 - Backend** | 🚧 En cours | Intégration Stripe/Supabase/Mux (services côté client prêts) |
| **Phase 3 - Polish** | 📅 Planifié | Notifications, traductions complètes, optimisation, tests |
| **Phase 4 - Launch** | 📅 Planifié | App Store / Play Store, CI/CD, monitoring |

---

## 11. Statistiques

| Métrique | Valeur |
|----------|--------|
| Fichiers TypeScript/TSX | ~22 |
| Écrans | 10 |
| Composants réutilisables | 3 |
| Services backend | 3 |
| Hooks personnalisés | 1 |
| Dépendances de production | 33 |
| Langues supportées | 8 |
| Commits | ~11 |

---

*Analyse générée automatiquement le 2026-01-28*
