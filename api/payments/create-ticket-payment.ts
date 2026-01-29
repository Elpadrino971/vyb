/**
 * Create Ticket Payment Endpoint
 * POST /api/payments/create-ticket-payment
 *
 * Creates a Stripe PaymentIntent for concert ticket purchase
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Initialize Supabase Admin Client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RequestBody {
  concertId: string;
  amount: number;
  currency?: string;
}

export default async function handler(req: Request): Promise<Response> {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight
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
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing token' }),
        { status: 401, headers }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    const { concertId, amount, currency = 'eur' } = body;

    if (!concertId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing concertId or amount' }),
        { status: 400, headers }
      );
    }

    // Verify concert exists and get details
    const { data: concert, error: concertError } = await supabase
      .from('concerts')
      .select('*, artists(artist_name)')
      .eq('id', concertId)
      .single();

    if (concertError || !concert) {
      return new Response(
        JSON.stringify({ error: 'Concert not found' }),
        { status: 404, headers }
      );
    }

    // Check if user already has a ticket for this concert
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('id')
      .eq('concert_id', concertId)
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .single();

    if (existingTicket) {
      return new Response(
        JSON.stringify({ error: 'You already have a ticket for this concert' }),
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

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create ephemeral key for customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2023-10-16' }
    );

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        concert_id: concertId,
        user_id: user.id,
        type: 'ticket',
        concert_title: concert.title,
      },
    });

    // Create pending ticket record
    await supabase.from('tickets').insert({
      concert_id: concertId,
      user_id: user.id,
      stripe_payment_intent_id: paymentIntent.id,
      price_paid: amount,
      currency: currency,
      status: 'pending',
      purchased_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customerId: customerId,
        customer: customerId,
      }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Payment error:', error);
    return new Response(
      JSON.stringify({
        error: 'Payment creation failed',
        message: error.message
      }),
      { status: 500, headers }
    );
  }
}

// Vercel Edge Config
export const config = {
  runtime: 'edge',
};
