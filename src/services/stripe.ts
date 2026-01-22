/**
 * Stripe Service
 * Payment processing for concert tickets and Pro subscriptions
 */

import Constants from 'expo-constants';

const stripePublishableKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key. Check your .env file.');
}

export const STRIPE_CONFIG = {
  publishableKey: stripePublishableKey,
  merchantIdentifier: 'merchant.app.vybzzz', // For Apple Pay
  urlScheme: 'vybzzz', // For redirect flows
};

// Pricing constants
export const PRICING = {
  PRO_SUBSCRIPTION_MONTHLY: {
    priceId: 'price_pro_monthly', // Will be created in Stripe Dashboard
    amount: 5900, // 59.00 EUR in cents
    currency: 'eur',
    interval: 'month',
    description: 'Abonnement Pro - Devenez artiste sur Vybzzz',
    features: [
      'Créez des concerts en illimité',
      'Streaming live HD',
      'Analytics avancés',
      'Split 70/30 le plus généreux du marché',
      'Support prioritaire',
    ],
  },
  FOUNDER_BADGE: {
    description: 'Badge Founder - Premium à vie',
    features: [
      '🏆 Badge "Founder" exclusif',
      '💎 Accès premium à vie',
      '⭐ Badge vérifié prioritaire',
      '📊 Analytics premium',
      '🎯 Promotion prioritaire',
    ],
    limitedTo: 50, // First 50 artists only
  },
  REVENUE_SPLIT: {
    ARTIST_PERCENTAGE: 70,
    PLATFORM_PERCENTAGE: 30,
  },
};

/**
 * Create payment intent for concert ticket
 */
export const createTicketPaymentIntent = async (
  concertId: string,
  amount: number,
  currency: string = 'eur'
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  // This will call your backend API
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_RORK_API_BASE_URL || process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  const response = await fetch(`${apiUrl}/api/payments/create-ticket-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      concertId,
      amount,
      currency,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  const data = await response.json();
  return {
    clientSecret: data.clientSecret,
    paymentIntentId: data.paymentIntentId,
  };
};

/**
 * Create subscription for Pro account
 */
export const createProSubscription = async (
  userId: string,
  isFounder: boolean = false
): Promise<{ clientSecret: string; subscriptionId: string }> => {
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_RORK_API_BASE_URL || process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  const response = await fetch(`${apiUrl}/api/subscriptions/create-pro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      isFounder,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  const data = await response.json();
  return {
    clientSecret: data.clientSecret,
    subscriptionId: data.subscriptionId,
  };
};

/**
 * Calculate artist payout (70% of revenue)
 */
export const calculateArtistPayout = (totalRevenue: number): {
  artistAmount: number;
  platformAmount: number;
  revenueSplit: number;
} => {
  const artistAmount = Math.floor(totalRevenue * (PRICING.REVENUE_SPLIT.ARTIST_PERCENTAGE / 100));
  const platformAmount = totalRevenue - artistAmount;

  return {
    artistAmount,
    platformAmount,
    revenueSplit: PRICING.REVENUE_SPLIT.ARTIST_PERCENTAGE,
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe uses cents
};
