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

// Pricing constants - Real Stripe Price IDs
export const PRICING = {
  // Subscription Plans
  SUBSCRIPTIONS: {
    SMART: {
      priceId: 'price_1Suw1xH2HsUSSb9aqYsP6nJG',
      amount: 3900, // 39.00 EUR in cents
      currency: 'eur',
      interval: 'month',
      name: 'Smart',
      revenueSplit: 50,
      description: 'Abonnement Smart - Modèle 50/50',
      features: [
        'Créez des concerts en illimité',
        'Streaming live HD',
        'Analytics de base',
        'Split 50/50',
        'Support email',
      ],
    },
    PRO: {
      priceId: 'price_1SuvybH2HsUSSb9aFyxvGX2N',
      amount: 7900, // 79.00 EUR in cents
      currency: 'eur',
      interval: 'month',
      name: 'Pro',
      revenueSplit: 60,
      description: 'Abonnement Pro - Modèle 60/40',
      features: [
        'Créez des concerts en illimité',
        'Streaming live Full HD',
        'Analytics avancés',
        'Split 60/40',
        'Support prioritaire',
        'Badge Pro vérifié',
      ],
    },
    PREMIUM: {
      priceId: 'price_1SOPkQH2HsUSSb9aBjZt16TY',
      amount: 9900, // 99.00 EUR in cents
      currency: 'eur',
      interval: 'month',
      name: 'Premium',
      revenueSplit: 70,
      description: 'Abonnement Premium - Modèle 70/30',
      features: [
        'Créez des concerts en illimité',
        'Streaming live 4K',
        'Analytics premium + exports',
        'Split 70/30 - Le plus généreux',
        'Support VIP 24/7',
        'Badge Premium exclusif',
        'Promotion prioritaire',
        'Replays illimités',
      ],
    },
  },
  // Ticket Prices
  TICKETS: {
    DEFAULT: {
      priceId: 'price_1SuwJPH2HsUSSb9ajzbPMcfQ',
      amount: 3000, // 30.00 EUR
      currency: 'eur',
      label: 'Standard',
    },
    REDUCED: {
      priceId: 'price_1SuwJPH2HsUSSb9ac69XCT9M',
      amount: 1800, // 18.00 EUR
      currency: 'eur',
      label: 'Réduit',
    },
    PREMIUM: {
      priceId: 'price_1SuwJPH2HsUSSb9afGoRZqSp',
      amount: 6000, // 60.00 EUR
      currency: 'eur',
      label: 'Premium',
    },
  },
  // Legacy - kept for backward compatibility
  PRO_SUBSCRIPTION_MONTHLY: {
    priceId: 'price_1SuvybH2HsUSSb9aFyxvGX2N',
    amount: 7900,
    currency: 'eur',
    interval: 'month',
    description: 'Abonnement Pro - Devenez artiste sur Vybzzz',
    features: [
      'Créez des concerts en illimité',
      'Streaming live HD',
      'Analytics avancés',
      'Split 60/40',
      'Support prioritaire',
    ],
  },
  FOUNDER_BADGE: {
    priceId: 'price_1SOPkQH2HsUSSb9aBjZt16TY',
    amount: 9900,
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
    SMART_PERCENTAGE: 50,
    PRO_PERCENTAGE: 60,
    PREMIUM_PERCENTAGE: 70,
    ARTIST_PERCENTAGE: 70, // Default for Premium
    PLATFORM_PERCENTAGE: 30,
  },
};

/**
 * Get the Supabase Functions URL
 * Uses Supabase Edge Functions instead of external API
 */
const getSupabaseFunctionsUrl = (): string => {
  const supabaseUrl =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Supabase URL non configurée.');
  }
  return `${supabaseUrl}/functions/v1`;
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
 * Fetch payment sheet parameters from Supabase Edge Function
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
  const functionsUrl = getSupabaseFunctionsUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${functionsUrl}/create-ticket-payment`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ concertId, amount, currency }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || 'Échec de la création du paiement.'
    );
  }

  const data = await response.json();
  return {
    paymentIntent: data.paymentIntent || data.clientSecret,
    ephemeralKey: data.ephemeralKey || '',
    customer: data.customer || data.customerId || '',
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
 * Subscription plan types
 */
export type SubscriptionPlan = 'smart' | 'pro' | 'premium';

/**
 * Get subscription details by plan type
 */
export const getSubscriptionPlan = (plan: SubscriptionPlan) => {
  const plans = {
    smart: PRICING.SUBSCRIPTIONS.SMART,
    pro: PRICING.SUBSCRIPTIONS.PRO,
    premium: PRICING.SUBSCRIPTIONS.PREMIUM,
  };
  return plans[plan];
};

/**
 * Fetch subscription payment sheet params from Supabase Edge Function
 */
export const fetchSubscriptionParams = async (
  userId: string,
  plan: SubscriptionPlan = 'pro'
): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  subscriptionId: string;
}> => {
  const functionsUrl = getSupabaseFunctionsUrl();
  const headers = await getAuthHeaders();

  const response = await fetch(`${functionsUrl}/create-subscription`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ plan }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || 'Échec de la création de l\'abonnement.'
    );
  }

  const data = await response.json();
  return {
    paymentIntent: data.paymentIntent || data.clientSecret,
    ephemeralKey: data.ephemeralKey || '',
    customer: data.customer || data.customerId || '',
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
