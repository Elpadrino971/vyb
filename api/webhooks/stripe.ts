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
          // Update ticket status to paid
          const { data: ticket, error } = await supabase
            .from('tickets')
            .update({
              status: 'paid',
              qr_code: generateQRCode(
                paymentIntent.id,
                concert_id,
                user_id
              ),
            })
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .select()
            .single();

          if (error) {
            console.error('Error updating ticket:', error);
          } else {
            // Update concert revenue
            await supabase.rpc('increment_concert_revenue', {
              concert_id_param: concert_id,
              amount_param: paymentIntent.amount,
            });

            console.log(`Ticket confirmed: ${ticket?.id}`);
          }
        } else if (type === 'founder_badge') {
          // Create or update artist with founder badge
          const { error } = await supabase
            .from('artists')
            .upsert({
              user_id: user_id,
              is_founder: true,
              is_verified: true,
              revenue_split: 70,
            }, {
              onConflict: 'user_id',
            });

          // Update profile role
          await supabase
            .from('profiles')
            .update({ role: 'artist' })
            .eq('id', user_id);

          if (error) {
            console.error('Error creating founder artist:', error);
          } else {
            console.log(`Founder badge activated for user: ${user_id}`);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.user_id;

        if (subscription.status === 'active') {
          // Create or update artist profile
          const { error } = await supabase
            .from('artists')
            .upsert({
              user_id: userId,
              is_verified: true,
              is_founder: false,
              revenue_split: 70,
              stripe_subscription_id: subscription.id,
            }, {
              onConflict: 'user_id',
            });

          // Update profile role
          await supabase
            .from('profiles')
            .update({ role: 'artist' })
            .eq('id', userId);

          if (error) {
            console.error('Error activating pro subscription:', error);
          } else {
            console.log(`Pro subscription activated for user: ${userId}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.user_id;

        // Check if user is founder (founders don't lose access)
        const { data: artist } = await supabase
          .from('artists')
          .select('is_founder')
          .eq('user_id', userId)
          .single();

        if (!artist?.is_founder) {
          // Deactivate non-founder artist
          await supabase
            .from('artists')
            .update({ is_verified: false })
            .eq('user_id', userId);

          await supabase
            .from('profiles')
            .update({ role: 'fan' })
            .eq('id', userId);

          console.log(`Pro subscription cancelled for user: ${userId}`);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        // Update ticket status
        await supabase
          .from('tickets')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent_id', paymentIntentId);

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
