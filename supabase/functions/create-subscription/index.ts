// Supabase Edge Function: create-subscription
// Creates Stripe Subscription for artist accounts (Smart/Pro/Premium)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

// Real Stripe Price IDs
const PRICES = {
  smart: Deno.env.get('STRIPE_PRICE_SMART') || 'price_1Suw1xH2HsUSSb9aqYsP6nJG',
  pro: Deno.env.get('STRIPE_PRICE_PRO') || 'price_1SuvybH2HsUSSb9aFyxvGX2N',
  premium: Deno.env.get('STRIPE_PRICE_PREMIUM') || 'price_1SOPkQH2HsUSSb9aBjZt16TY',
}

const REVENUE_SPLITS = {
  smart: 50,
  pro: 60,
  premium: 70,
}

type Plan = 'smart' | 'pro' | 'premium'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { plan = 'pro' } = await req.json() as { plan?: Plan }

    // Validate plan
    if (!['smart', 'pro', 'premium'].includes(plan)) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan. Choose: smart, pro, or premium' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const priceId = PRICES[plan]
    const revenueSplit = REVENUE_SPLITS[plan]

    // Check if already an artist with active subscription
    const { data: existingArtist } = await supabaseClient
      .from('Artist')
      .select('id, subscriptionPlan')
      .eq('userId', user.id)
      .single()

    if (existingArtist?.subscriptionPlan) {
      return new Response(
        JSON.stringify({ error: 'Vous avez déjà un abonnement actif' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get or create Stripe customer
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single()

    let customerId: string

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create ephemeral key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2023-10-16' }
    )

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        user_id: user.id,
        plan,
        revenue_split: revenueSplit.toString(),
        type: `${plan}_subscription`,
      },
    })

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    return new Response(
      JSON.stringify({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customerId,
        subscriptionId: subscription.id,
        plan,
        revenueSplit,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Subscription error:', error)
    return new Response(
      JSON.stringify({ error: 'Subscription creation failed', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
