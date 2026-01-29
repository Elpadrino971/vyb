/**
 * Create Subscription Endpoint
 * POST /api/subscriptions/create-pro
 *
 * Creates a Stripe Subscription for artist accounts
 * Supports Smart (50/50), Pro (60/40), and Premium (70/30) plans
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Real Stripe Price IDs
const PRICES = {
  SMART: process.env.STRIPE_PRICE_SMART || 'price_1Suw1xH2HsUSSb9aqYsP6nJG',
  PRO: process.env.STRIPE_PRICE_PRO || 'price_1SuvybH2HsUSSb9aFyxvGX2N',
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM || 'price_1SOPkQH2HsUSSb9aBjZt16TY',
};

const REVENUE_SPLITS = {
  smart: 50,
  pro: 60,
  premium: 70,
};

type SubscriptionPlan = 'smart' | 'pro' | 'premium';

interface RequestBody {
  userId: string;
  plan?: SubscriptionPlan;
  priceId?: string;
  revenueSplit?: number;
  isFounder?: boolean; // Legacy support
}

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers }
      );
    }

    const body: RequestBody = await req.json();
    const { plan = 'pro', priceId, revenueSplit, isFounder = false } = body;

    // Determine price ID and revenue split based on plan
    let selectedPriceId: string;
    let selectedRevenueSplit: number;

    if (priceId) {
      selectedPriceId = priceId;
      selectedRevenueSplit = revenueSplit || REVENUE_SPLITS[plan];
    } else if (isFounder) {
      // Legacy: Founder maps to Premium
      selectedPriceId = PRICES.PREMIUM;
      selectedRevenueSplit = 70;
    } else {
      selectedPriceId = PRICES[plan.toUpperCase() as keyof typeof PRICES] || PRICES.PRO;
      selectedRevenueSplit = REVENUE_SPLITS[plan] || 60;
    }

    // Check if user is already an artist (in Artist table - PascalCase)
    const { data: existingArtist } = await supabase
      .from('Artist')
      .select('id, subscriptionPlan')
      .eq('userId', user.id)
      .single();

    if (existingArtist?.subscriptionPlan) {
      return new Response(
        JSON.stringify({ error: 'Vous avez déjà un abonnement actif' }),
        { status: 400, headers }
      );
    }

    // Get or create Stripe customer
    let customerId: string;

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single();

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create ephemeral key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2023-10-16' }
    );

    let clientSecret: string;
    let subscriptionId: string | null = null;

    // Create subscription with selected plan
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: selectedPriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        user_id: user.id,
        plan: plan,
        revenue_split: selectedRevenueSplit.toString(),
        type: `${plan}_subscription`,
      },
    });

    subscriptionId = subscription.id;
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
    clientSecret = paymentIntent.client_secret!;

    return new Response(
      JSON.stringify({
        clientSecret,
        paymentIntent: clientSecret,
        ephemeralKey: ephemeralKey.secret,
        customerId,
        customer: customerId,
        subscriptionId,
        plan,
        revenueSplit: selectedRevenueSplit,
      }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({
        error: 'Subscription creation failed',
        message: error.message,
      }),
      { status: 500, headers }
    );
  }
}

export const config = {
  runtime: 'edge',
};
