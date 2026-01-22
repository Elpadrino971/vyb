/**
 * Stripe Products Configuration
 * Instructions pour créer les produits dans Stripe Dashboard
 */

/*
=======================================================
PRODUIT 1 : ABONNEMENT PRO (59€/mois)
=======================================================

Dans Stripe Dashboard (https://dashboard.stripe.com/test/products):

1. Créer un nouveau produit :
   - Nom : "Vybzzz Pro - Abonnement Artiste"
   - Description : "Devenez artiste pro sur Vybzzz. Créez des concerts illimités et gagnez 70% des revenus."
   - Image : (logo Vybzzz)

2. Ajouter un prix récurrent :
   - Modèle de tarification : Récurrent
   - Prix : 59,00 €
   - Fréquence : Mensuel
   - ID du prix : price_vybzzz_pro_monthly
   - Devise : EUR

3. Métadonnées :
   - type: "pro_subscription"
   - revenue_split: "70"
   - features: "unlimited_concerts,analytics,priority_support,hd_streaming"

=======================================================
PRODUIT 2 : FOUNDER BADGE (Paiement unique)
=======================================================

1. Créer un nouveau produit :
   - Nom : "Vybzzz Founder - Premium à Vie"
   - Description : "🏆 Badge Founder exclusif - Premium à vie pour les 50 premiers artistes. Includes all Pro features forever."
   - Image : (badge founder)

2. Ajouter un prix unique :
   - Modèle de tarification : Ponctuel
   - Prix : 59,00 €
   - ID du prix : price_vybzzz_founder_lifetime
   - Devise : EUR

3. Métadonnées :
   - type: "founder_badge"
   - revenue_split: "70"
   - is_lifetime: "true"
   - limited_to: "50"
   - features: "all_pro_features,founder_badge,verified_priority,premium_analytics,lifetime_access"

=======================================================
ALTERNATIVE : VIA STRIPE CLI
=======================================================

# Si vous préférez créer via CLI :

# 1. Installer Stripe CLI
brew install stripe/stripe-cli/stripe
stripe login

# 2. Créer le produit Pro
stripe products create \
  --name="Vybzzz Pro - Abonnement Artiste" \
  --description="Devenez artiste pro sur Vybzzz. Créez des concerts illimités et gagnez 70% des revenus."

# 3. Créer le prix mensuel (remplacez prod_XXX par l'ID du produit créé)
stripe prices create \
  --product=prod_XXX \
  --unit-amount=5900 \
  --currency=eur \
  --recurring[interval]=month \
  --lookup-key=vybzzz_pro_monthly

# 4. Créer le produit Founder
stripe products create \
  --name="Vybzzz Founder - Premium à Vie" \
  --description="🏆 Badge Founder exclusif - Premium à vie pour les 50 premiers artistes"

# 5. Créer le prix unique Founder
stripe prices create \
  --product=prod_YYY \
  --unit-amount=5900 \
  --currency=eur \
  --lookup-key=vybzzz_founder_lifetime

=======================================================
WEBHOOKS À CONFIGURER
=======================================================

Dans Stripe Dashboard > Developers > Webhooks :

URL endpoint : https://vybzzz-streaming-platform.rork.app/api/webhooks/stripe
Secret : whsec_... (sera généré automatiquement)

Événements à écouter :
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed
- payment_intent.succeeded

=======================================================
COUPON PROMOTIONNEL (Optionnel)
=======================================================

Pour offrir une réduction aux 10 premiers founders :

stripe coupons create \
  --percent-off=20 \
  --duration=once \
  --name="FOUNDER10" \
  --max-redemptions=10

*/

// Prix IDs à utiliser dans votre code
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: 'price_vybzzz_pro_monthly', // À remplacer par le vrai ID après création
  FOUNDER_LIFETIME: 'price_vybzzz_founder_lifetime', // À remplacer par le vrai ID après création
};

// Produits IDs
export const STRIPE_PRODUCT_IDS = {
  PRO_SUBSCRIPTION: 'prod_vybzzz_pro', // À remplacer après création
  FOUNDER_BADGE: 'prod_vybzzz_founder', // À remplacer après création
};
