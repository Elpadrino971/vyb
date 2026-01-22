# 🎯 Configuration Stripe pour Vybzzz

Guide complet pour configurer les produits et abonnements Stripe.

---

## 📋 Produits à Créer

### 1️⃣ Abonnement Pro (59€/mois)

**Dashboard Stripe** : https://dashboard.stripe.com/test/products

#### Informations du Produit
```
Nom du produit : Vybzzz Pro - Abonnement Artiste
Description : Devenez artiste pro sur Vybzzz. Créez des concerts illimités et gagnez 70% des revenus.
```

#### Prix
```
Type : Récurrent
Montant : 59,00 €
Fréquence : Mensuel
Devise : EUR
Lookup Key : vybzzz_pro_monthly
```

#### Métadonnées du Produit
| Clé | Valeur |
|-----|--------|
| `type` | `pro_subscription` |
| `revenue_split` | `70` |
| `features` | `unlimited_concerts,hd_streaming,analytics,priority_support` |

---

### 2️⃣ Badge Founder (59€ paiement unique)

#### Informations du Produit
```
Nom du produit : Vybzzz Founder - Premium à Vie 🏆
Description : Badge Founder exclusif - Premium à vie pour les 50 premiers artistes. Tous les avantages Pro pour toujours.
```

#### Prix
```
Type : Ponctuel (one-time)
Montant : 59,00 €
Devise : EUR
Lookup Key : vybzzz_founder_lifetime
```

#### Métadonnées du Produit
| Clé | Valeur |
|-----|--------|
| `type` | `founder_badge` |
| `revenue_split` | `70` |
| `is_lifetime` | `true` |
| `limited_to` | `50` |
| `features` | `all_pro_features,founder_badge,verified_priority,premium_analytics,lifetime_access` |

---

## 🔧 Configuration via Stripe CLI

Si vous préférez créer via CLI :

### Installation
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login
```

### Créer les Produits

```bash
# 1. Produit Pro
stripe products create \
  --name="Vybzzz Pro - Abonnement Artiste" \
  --description="Devenez artiste pro sur Vybzzz. Créez des concerts illimités et gagnez 70% des revenus." \
  --metadata[type]=pro_subscription \
  --metadata[revenue_split]=70

# Notez le product ID (ex: prod_ABC123)

# 2. Prix mensuel Pro
stripe prices create \
  --product=prod_ABC123 \
  --unit-amount=5900 \
  --currency=eur \
  --recurring[interval]=month \
  --lookup-key=vybzzz_pro_monthly

# 3. Produit Founder
stripe products create \
  --name="Vybzzz Founder - Premium à Vie" \
  --description="🏆 Badge Founder exclusif pour les 50 premiers artistes" \
  --metadata[type]=founder_badge \
  --metadata[is_lifetime]=true \
  --metadata[limited_to]=50

# 4. Prix unique Founder
stripe prices create \
  --product=prod_XYZ789 \
  --unit-amount=5900 \
  --currency=eur \
  --lookup-key=vybzzz_founder_lifetime
```

---

## 🪝 Webhooks à Configurer

**URL** : `https://vybzzz-streaming-platform.rork.app/api/webhooks/stripe`

### Événements à Écouter

#### Paiements
- `checkout.session.completed` - Session de paiement terminée
- `payment_intent.succeeded` - Paiement réussi
- `payment_intent.payment_failed` - Paiement échoué

#### Abonnements
- `customer.subscription.created` - Nouvel abonnement
- `customer.subscription.updated` - Abonnement modifié
- `customer.subscription.deleted` - Abonnement annulé
- `invoice.paid` - Facture payée
- `invoice.payment_failed` - Paiement facture échoué

#### Artistes (Stripe Connect)
- `account.updated` - Compte artiste mis à jour
- `payout.created` - Paiement créé pour artiste
- `payout.paid` - Paiement effectué à l'artiste

---

## 💰 Coupons Promotionnels (Optionnel)

### Réduction 20% pour les 10 premiers Founders

```bash
stripe coupons create \
  --percent-off=20 \
  --duration=once \
  --name="FOUNDER10" \
  --max-redemptions=10 \
  --metadata[type]=early_founder
```

### Essai gratuit 1 mois

```bash
stripe coupons create \
  --duration=repeating \
  --duration-in-months=1 \
  --percent-off=100 \
  --name="TRIAL1MONTH"
```

---

## 🔑 Après Création : Mettre à Jour le Code

1. **Copiez les Price IDs** depuis Stripe Dashboard
2. **Mettez à jour** `src/services/stripe.ts` :

```typescript
export const PRICING = {
  PRO_SUBSCRIPTION_MONTHLY: {
    priceId: 'price_1ABC...XYZ', // ← Remplacez ici
    // ...
  },
  FOUNDER_BADGE: {
    priceId: 'price_2DEF...ABC', // ← Remplacez ici
    // ...
  },
};
```

3. **Configurez le webhook secret** dans `.env` :
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📊 Dashboard Stripe Connect (pour les Artistes)

Pour gérer les paiements aux artistes (70/30 split) :

1. **Activer Stripe Connect** dans Dashboard
2. **Type** : Custom ou Express
3. **Configuration** :
   - Revenue split : 70% to connected account
   - Platform fee : 30%

### Code pour créer un Connected Account

```typescript
const account = await stripe.accounts.create({
  type: 'express',
  country: 'FR',
  email: artist.email,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  metadata: {
    artist_id: artist.id,
    revenue_split: '70',
  },
});
```

---

## ✅ Checklist de Configuration

- [ ] Produit "Vybzzz Pro" créé
- [ ] Prix mensuel 59€ créé
- [ ] Produit "Vybzzz Founder" créé
- [ ] Prix unique 59€ créé
- [ ] Webhooks configurés
- [ ] Price IDs copiés dans le code
- [ ] Webhook secret dans .env
- [ ] Test de paiement effectué
- [ ] Stripe Connect activé (pour payouts artistes)

---

## 🧪 Mode Test

Cartes de test Stripe :

| Carte | Résultat |
|-------|----------|
| `4242 4242 4242 4242` | ✅ Paiement réussi |
| `4000 0000 0000 9995` | ❌ Paiement refusé (fonds insuffisants) |
| `4000 0000 0000 0002` | ❌ Paiement refusé (carte refusée) |

Date d'expiration : N'importe quelle date future
CVC : N'importe quel 3 chiffres

---

## 🚀 Passage en Production

Avant de passer en mode live :

1. Répéter toutes les étapes ci-dessus en mode **Live**
2. Remplacer les clés test par les clés live dans `.env`
3. Configurer les webhooks live
4. Vérifier la conformité réglementaire (RGPD, DSP2)
5. Activer l'authentification forte (3D Secure)

---

## 📞 Support

- **Stripe Docs** : https://stripe.com/docs
- **Dashboard** : https://dashboard.stripe.com
- **Support** : https://support.stripe.com
