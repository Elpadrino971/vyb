// Supabase Edge Function: stripe-webhook
// Handles Stripe webhook events for payment confirmations

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Generate QR code data
function generateQRCode(ticketId: string, concertId: string, userId: string): string {
  const data = {
    ticketId,
    concertId,
    userId,
    timestamp: Date.now(),
    signature: btoa(`${ticketId}:${concertId}:${Deno.env.get('QR_SECRET') || 'vybzzz'}`),
  }
  return btoa(JSON.stringify(data))
}

serve(async (req) => {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
    }

    // Use service role for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Processing webhook event: ${event.type}`)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { type, concert_id, user_id } = paymentIntent.metadata

        if (type === 'ticket') {
          // Update ticket status to paid
          const { data: ticket, error } = await supabase
            .from('Ticket')
            .update({
              status: 'paid',
              qrCode: generateQRCode(paymentIntent.id, concert_id, user_id),
            })
            .eq('stripePaymentIntentId', paymentIntent.id)
            .select()
            .single()

          if (error) {
            console.error('Error updating ticket:', error)
          } else {
            // Update concert revenue
            const { data: concert } = await supabase
              .from('Concert')
              .select('totalRevenue')
              .eq('id', concert_id)
              .single()

            await supabase
              .from('Concert')
              .update({ totalRevenue: (concert?.totalRevenue || 0) + paymentIntent.amount })
              .eq('id', concert_id)

            console.log(`Ticket confirmed: ${ticket?.id}`)
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id
        const plan = subscription.metadata.plan || 'pro'
        const revenueSplit = parseInt(subscription.metadata.revenue_split || '60')

        if (subscription.status === 'active') {
          // Create or update artist profile
          const { error } = await supabase
            .from('Artist')
            .upsert({
              userId,
              isVerified: true,
              subscriptionPlan: plan,
              revenueSplit,
              stripeSubscriptionId: subscription.id,
            }, { onConflict: 'userId' })

          // Update user role
          await supabase
            .from('User')
            .update({ role: 'artist' })
            .eq('id', userId)

          if (error) {
            console.error('Error activating subscription:', error)
          } else {
            console.log(`${plan} subscription activated for user: ${userId}`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id

        // Deactivate artist
        await supabase
          .from('Artist')
          .update({ isVerified: false, subscriptionPlan: null })
          .eq('userId', userId)

        await supabase
          .from('User')
          .update({ role: 'fan' })
          .eq('id', userId)

        console.log(`Subscription cancelled for user: ${userId}`)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        await supabase
          .from('Ticket')
          .update({ status: 'refunded' })
          .eq('stripePaymentIntentId', paymentIntentId)

        console.log(`Refund processed for payment: ${paymentIntentId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), { status: 500 })
  }
})
