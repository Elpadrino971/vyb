/**
 * Stripe Service
 * Payment processing for concert tickets and Pro subscriptions
 */

import Constants from 'expo-constants';
import { supabase } from '@/services/supabase';

const stripePublishableKey =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  '';

if (!stripePublishableKey) {
  console.warn('Missing Stripe publishable key. Payment features will be limited. Check your .env file.');
}

export const STRIPE_CONFIG = {
  publishableKey: stripePublishableKey,
  merchantIdentifier: 'merchant.app.vybzzz',
  urlScheme: 'vybzzz',
};

// Pricing constants
export const PRICING = {
  PRO_SUBSCRIPTION_MONTHLY: {
    priceId: 'price_vybzzz_pro_monthly',
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
    priceId: 'price_vybzzz_founder_lifetime',
    amount: 5900, // 59.00 EUR in cents (one-time payment)
    currency: 'eur',
    description: 'Badge Founder - Premium à vie',
    features: [
      '🏆 Badge "Founder" exclusif',
      '💎 Accès premium à vie',
      '⭐ Badge vérifié prioritaire',
      '📊 Analytics premium',
      '🎯 Promotion prioritaire',
    ],
    limitedTo: 50,
  },
  REVENUE_SPLIT: {
    ARTIST_PERCENTAGE: 70,
    PLATFORM_PERCENTAGE: 30,
  },
};

/**
 * Get the API base URL for backend calls
 */
const getApiUrl = (): string => {
  const url =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_RORK_API_BASE_URL ||
    process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (!url) {
    throw new Error(
      'Backend API URL non configurée. Ajoutez EXPO_PUBLIC_RORK_API_BASE_URL dans votre fichier .env'
    );
  }
  return url;
};

/**
 * Get auth headers for authenticated API requests
 */
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
};

/**
 * Fetch payment sheet parameters from backend
 * Returns clientSecret, ephemeralKey, and customerId for PaymentSheet
 */
export const fetchPaymentSheetParams = async (
  concertId: string,
  amount: number,
  currency: string = 'eur'
): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> => {
  const apiUrl = getApiUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${apiUrl}/api/payments/create-ticket-payment`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ concertId, amount, currency }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 'Échec de la création du paiement. Vérifiez la configuration backend.'
    );
  }

  const data = await response.json();
  return {
    paymentIntent: data.clientSecret || data.paymentIntent,
    ephemeralKey: data.ephemeralKey || '',
    customer: data.customerId || data.customer || '',
  };
};

/**
 * Create payment intent for concert ticket (legacy - kept for compatibility)
 */
export const createTicketPaymentIntent = async (
  concertId: string,
  amount: number,
  currency: string = 'eur'
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  const params = await fetchPaymentSheetParams(concertId, amount, currency);
  return {
    clientSecret: params.paymentIntent,
    paymentIntentId: params.paymentIntent,
  };
};

/**
 * Fetch subscription payment sheet params from backend
 */
export const fetchSubscriptionParams = async (
  userId: string,
  isFounder: boolean = false
): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  subscriptionId: string;
}> => {
  const apiUrl = getApiUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${apiUrl}/api/subscriptions/create-pro`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId, isFounder }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 'Échec de la création de l\'abonnement. Vérifiez la configuration backend.'
    );
  }

  const data = await response.json();
  return {
    paymentIntent: data.clientSecret || data.paymentIntent,
    ephemeralKey: data.ephemeralKey || '',
    customer: data.customerId || data.customer || '',
    subscriptionId: data.subscriptionId || '',
  };
};

/**
 * Create subscription for Pro account (legacy - kept for compatibility)
 */
export const createProSubscription = async (
  userId: string,
  isFounder: boolean = false
): Promise<{ clientSecret: string; subscriptionId: string }> => {
  const params = await fetchSubscriptionParams(userId, isFounder);
  return {
    clientSecret: params.paymentIntent,
    subscriptionId: params.subscriptionId,
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
  }).format(amount / 100);
};
