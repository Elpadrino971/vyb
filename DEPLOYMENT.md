# Vybzzz - Guide de Déploiement Production

Ce guide vous accompagne étape par étape pour déployer Vybzzz en production.

## Table des Matières

1. [Prérequis](#1-prérequis)
2. [Configuration Stripe](#2-configuration-stripe)
3. [Configuration Supabase](#3-configuration-supabase)
4. [Configuration Mux](#4-configuration-mux)
5. [Déploiement Backend API](#5-déploiement-backend-api)
6. [Déploiement App Mobile](#6-déploiement-app-mobile)
7. [Configuration Webhooks](#7-configuration-webhooks)
8. [Test du Flux Complet](#8-test-du-flux-complet)
9. [Optimisation Performance](#9-optimisation-performance)
10. [Checklist Production](#10-checklist-production)

---

## 1. Prérequis

### Comptes Requis

- [ ] **Stripe** - https://stripe.com (paiements)
- [ ] **Supabase** - https://supabase.com (base de données, auth)
- [ ] **Mux** - https://mux.com (streaming vidéo)
- [ ] **Vercel** - https://vercel.com (hébergement API)
- [ ] **Expo** - https://expo.dev (build mobile)
- [ ] **Apple Developer** - Pour iOS ($99/an)
- [ ] **Google Play Console** - Pour Android ($25 one-time)

### Outils Locaux

```bash
# Node.js 18+
node --version

# npm ou yarn
npm --version

# Expo CLI
npm install -g expo-cli eas-cli

# Vercel CLI
npm install -g vercel
```

---

## 2. Configuration Stripe

### 2.1 Créer les Produits

1. Aller sur https://dashboard.stripe.com/products
2. Cliquer **+ Add product**

**Produit 1: Pro Subscription**
```
Nom: Vybzzz Pro Subscription
Description: Devenez artiste sur Vybzzz
Prix: 59.00 EUR / mois (récurrent)
```
→ Noter le `price_id`: `price_xxx`

**Produit 2: Founder Badge**
```
Nom: Vybzzz Founder Badge
Description: Badge Founder exclusif - Premium à vie
Prix: 59.00 EUR (paiement unique)
Metadata: { "type": "founder", "limit": "50" }
```
→ Noter le `price_id`: `price_xxx`

### 2.2 Récupérer les Clés API

Dashboard > Developers > API Keys

```
Publishable key: pk_live_xxx (ou pk_test_xxx pour test)
Secret key: sk_live_xxx (ou sk_test_xxx pour test)
```

### 2.3 Configurer les Webhooks (après déploiement API)

Dashboard > Developers > Webhooks > Add endpoint

```
URL: https://your-api.vercel.app/api/webhooks/stripe
Événements à sélectionner:
- payment_intent.succeeded
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- charge.refunded
```
→ Noter le `Webhook signing secret`: `whsec_xxx`

---

## 3. Configuration Supabase

### 3.1 Créer un Projet

1. Aller sur https://supabase.com/dashboard
2. **New project**
3. Choisir région (EU West pour utilisateurs français)

### 3.2 Récupérer les Clés

Settings > API

```
Project URL: https://xxx.supabase.co
anon key: eyJxxx...
service_role key: eyJxxx... (GARDER SECRET!)
```

### 3.3 Exécuter les Migrations

1. Aller dans **SQL Editor**
2. Coller le contenu de `supabase/migrations/001_initial_schema.sql`
3. Cliquer **Run**

### 3.4 Configurer l'Auth

Authentication > Providers

**Email:**
- [x] Enable Email provider
- [ ] Confirm email (désactiver pour test, activer en production)

**URL Configuration:**
- Site URL: `vybzzz://` (pour deep linking)
- Redirect URLs: `vybzzz://auth/callback`

### 3.5 Activer Realtime

Database > Replication

- [x] concerts
- [x] chat_messages

---

## 4. Configuration Mux

### 4.1 Créer un Environment

1. Aller sur https://dashboard.mux.com
2. **Settings** > **Environments**
3. Créer un environment "production"

### 4.2 Créer des API Tokens

Settings > API Access Tokens > Generate new token

```
Nom: vybzzz-api
Permissions: Mux Video (Full Access)
```
→ Noter:
- Token ID: `xxx`
- Token Secret: `xxx`

### 4.3 Configurer les Webhooks (après déploiement API)

Settings > Webhooks > Add webhook

```
URL: https://your-api.vercel.app/api/webhooks/mux
Événements:
- video.live_stream.active
- video.live_stream.idle
- video.live_stream.connected
- video.live_stream.disconnected
- video.asset.ready
```
→ Noter le `Signing Secret`: `xxx`

### 4.4 Politique de Rétention VOD

Par défaut, Mux conserve les VOD (replays) pendant **7 jours** sur le plan standard.
C'est inclus sans frais supplémentaires.

---

## 5. Déploiement Backend API

### 5.1 Configuration Vercel

```bash
cd api
vercel login
vercel link
```

### 5.2 Ajouter les Variables d'Environnement

```bash
# Supabase
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Stripe
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_PRO_MONTHLY
vercel env add STRIPE_PRICE_FOUNDER

# Mux
vercel env add MUX_TOKEN_ID
vercel env add MUX_TOKEN_SECRET
vercel env add MUX_WEBHOOK_SECRET

# Security
vercel env add QR_SECRET
```

### 5.3 Déployer

```bash
vercel --prod
```

→ Noter l'URL: `https://vybzzz-api.vercel.app`

---

## 6. Déploiement App Mobile

### 6.1 Configurer les Variables d'Environnement

Créer `.env` à la racine du projet:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
EXPO_PUBLIC_MUX_ENV_KEY=xxx
EXPO_PUBLIC_RORK_API_BASE_URL=https://vybzzz-api.vercel.app
EXPO_PUBLIC_APP_ENV=production
```

### 6.2 Configurer EAS Build

```bash
eas login
eas build:configure
```

Modifier `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production"
      },
      "autoIncrement": true
    }
  }
}
```

### 6.3 Build et Submit

**iOS:**
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

**Android:**
```bash
eas build --platform android --profile production
eas submit --platform android
```

---

## 7. Configuration Webhooks

### 7.1 Stripe Webhook

1. Stripe Dashboard > Webhooks > Add endpoint
2. URL: `https://your-api.vercel.app/api/webhooks/stripe`
3. Sélectionner les événements
4. Copier le signing secret dans Vercel

### 7.2 Mux Webhook

1. Mux Dashboard > Settings > Webhooks
2. URL: `https://your-api.vercel.app/api/webhooks/mux`
3. Sélectionner les événements
4. Copier le signing secret dans Vercel

---

## 8. Test du Flux Complet

### Test 1: Inscription
1. Ouvrir l'app
2. Créer un compte
3. Vérifier le profil dans Supabase

### Test 2: Paiement Ticket
1. Trouver un concert
2. Acheter un billet (carte test: 4242 4242 4242 4242)
3. Vérifier le ticket dans la table `tickets`
4. Vérifier le paiement dans Stripe

### Test 3: Abonnement Pro
1. Aller dans "Devenir Pro"
2. S'abonner
3. Vérifier la table `artists`
4. Vérifier l'abonnement dans Stripe

### Test 4: Création Concert (artiste)
1. En tant qu'artiste, créer un concert
2. Vérifier la table `concerts`
3. Récupérer la stream key
4. Tester le streaming avec OBS

### Test 5: Streaming Live
1. Configurer OBS avec la stream key
2. Démarrer le stream
3. Vérifier le statut "live" dans l'app
4. Arrêter le stream
5. Vérifier que le replay est disponible (7 jours)

---

## 9. Optimisation Performance

### CDN pour Assets
Les thumbnails sont servies via Supabase Storage avec CDN intégré.

### Streaming Optimisé
Mux utilise automatiquement:
- Adaptive Bitrate (ABR)
- CDN global
- Low-latency mode

### Base de Données
- Index optimisés sur les tables fréquentes
- Realtime uniquement sur concerts et chat
- RLS pour sécurité sans surcharge

### Recommandations OBS pour Artistes
```
Résolution: 1920x1080
Bitrate: 4500 kbps
Framerate: 30 fps
Keyframe: 2 secondes
Encoder: x264 ou NVENC
```

---

## 10. Checklist Production

### Sécurité
- [ ] Toutes les clés secrètes sont dans les variables d'environnement
- [ ] RLS activé sur toutes les tables Supabase
- [ ] Webhooks avec vérification de signature
- [ ] HTTPS partout

### Paiements
- [ ] Produits Stripe créés
- [ ] Webhooks Stripe configurés
- [ ] Tests avec vraies cartes en mode test

### Streaming
- [ ] Mux configuré avec webhooks
- [ ] VOD/Replay activé (7 jours)
- [ ] Tests de streaming réels

### App Stores
- [ ] Screenshots pour App Store
- [ ] Descriptions en français/anglais
- [ ] Privacy Policy URL
- [ ] Terms of Service URL

### Monitoring
- [ ] Logs Vercel
- [ ] Dashboard Stripe
- [ ] Dashboard Mux
- [ ] Supabase logs

---

## Support

Pour toute question:
- Documentation Stripe: https://stripe.com/docs
- Documentation Supabase: https://supabase.com/docs
- Documentation Mux: https://docs.mux.com
- Documentation Expo: https://docs.expo.dev

---

*Guide créé le 29 janvier 2026*
*Version: 1.0.0*
