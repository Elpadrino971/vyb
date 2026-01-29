/**
 * Create Pro Subscription Endpoint
 * POST /api/subscriptions/create-pro
 *
 * Creates a Stripe Subscription for Pro artist account
 * Supports both monthly subscription and one-time Founder badge
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

// Price IDs - create these in Stripe Dashboard
const PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_vybzzz_pro_monthly',
  FOUNDER_LIFETIME: process.env.STRIPE_PRICE_FOUNDER || 'price_vybzzz_founder_lifetime',
};

const FOUNDER_LIMIT = 50;

interface RequestBody {
  userId: string;
  isFounder?: boolean;
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
    const { isFounder = false } = body;

    // If founder, check if limit reached
    if (isFounder) {
      const { count } = await supabase
        .from('artists')
        .select('id', { count: 'exact', head: true })
        .eq('is_founder', true);

      if (count !== null && count >= FOUNDER_LIMIT) {
        return new Response(
          JSON.stringify({ error: 'Founder badges are sold out (limit: 50)' }),
          { status: 400, headers }
        );
      }
    }

    // Check if user is already a pro artist
    const { data: existingArtist } = await supabase
      .from('artists')
      .select('id, is_verified')
      .eq('user_id', user.id)
      .single();

    if (existingArtist?.is_verified) {
      return new Response(
        JSON.stringify({ error: 'You are already a verified artist' }),
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

    if (isFounder) {
      // One-time payment for Founder badge
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 5900, // €59.00
        currency: 'eur',
        customer: customerId,
        automatic_payment_methods: { enabled: true },
        metadata: {
          user_id: user.id,
          type: 'founder_badge',
        },
      });
      clientSecret = paymentIntent.client_secret!;
    } else {
      // Monthly subscription for Pro
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: PRICES.PRO_MONTHLY }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          user_id: user.id,
          type: 'pro_subscription',
        },
      });

      subscriptionId = subscription.id;
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
      clientSecret = paymentIntent.client_secret!;
    }

    return new Response(
      JSON.stringify({
        clientSecret,
        paymentIntent: clientSecret,
        ephemeralKey: ephemeralKey.secret,
        customerId,
        customer: customerId,
        subscriptionId,
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
