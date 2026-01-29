/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 *
 * Handles payment confirmations, subscription events, and updates database
 * CRITICAL: This is where payments are confirmed and tickets/subscriptions activated
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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Generate QR code data (in production, use a proper QR library or service)
function generateQRCode(ticketId: string, concertId: string, userId: string): string {
  const data = {
    ticketId,
    concertId,
    userId,
    timestamp: Date.now(),
    signature: Buffer.from(`${ticketId}:${concertId}:${process.env.QR_SECRET || 'vybzzz'}`).toString('base64'),
  };
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 400, headers }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers }
      );
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { type, concert_id, user_id } = paymentIntent.metadata;

        if (type === 'ticket') {
          // Update ticket status to paid (PascalCase table + camelCase columns)
          const { data: ticket, error } = await supabase
            .from('Ticket')
            .update({
              status: 'paid',
              qrCode: generateQRCode(
                paymentIntent.id,
                concert_id,
                user_id
              ),
            })
            .eq('stripePaymentIntentId', paymentIntent.id)
            .select()
            .single();

          if (error) {
            console.error('Error updating ticket:', error);
          } else {
            // Update concert revenue
            await supabase
              .from('Concert')
              .update({ totalRevenue: paymentIntent.amount })
              .eq('id', concert_id);

            console.log(`Ticket confirmed: ${ticket?.id}`);
          }
        } else if (type.includes('subscription')) {
          // Subscription payments are handled in subscription.created/updated events
          console.log(`Subscription payment received for user: ${user_id}`);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.user_id;
        const plan = subscription.metadata.plan || 'pro';
        const revenueSplit = parseInt(subscription.metadata.revenue_split || '60');

        if (subscription.status === 'active') {
          // Create or update artist profile (PascalCase table)
          const { error } = await supabase
            .from('Artist')
            .upsert({
              userId: userId,
              isVerified: true,
              subscriptionPlan: plan,
              revenueSplit: revenueSplit,
              stripeSubscriptionId: subscription.id,
            }, {
              onConflict: 'userId',
            });

          // Update user role
          await supabase
            .from('User')
            .update({ role: 'artist' })
            .eq('id', userId);

          if (error) {
            console.error('Error activating subscription:', error);
          } else {
            console.log(`${plan} subscription activated for user: ${userId}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.user_id;

        // Deactivate artist
        await supabase
          .from('Artist')
          .update({
            isVerified: false,
            subscriptionPlan: null,
          })
          .eq('userId', userId);

        await supabase
          .from('User')
          .update({ role: 'fan' })
          .eq('id', userId);

        console.log(`Subscription cancelled for user: ${userId}`);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        // Update ticket status (PascalCase)
        await supabase
          .from('Ticket')
          .update({ status: 'refunded' })
          .eq('stripePaymentIntentId', paymentIntentId);

        console.log(`Refund processed for payment: ${paymentIntentId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers }
    );
  }
}

// Use Node.js runtime for raw body access (needed for Stripe signature verification)
export const config = {
  runtime: 'nodejs',
};
