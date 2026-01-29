/**
 * Mux Webhook Handler
 * POST /api/webhooks/mux
 *
 * Handles live stream status updates, VOD creation, and viewer analytics
 * Updates concert status in real-time
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;

// Verify Mux webhook signature
function verifyMuxSignature(body: string, signature: string, secret: string): boolean {
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
  const sig = parts.find(p => p.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !sig) return false;

  const payload = `${timestamp}.${body}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return sig === expected;
}

interface MuxWebhookEvent {
  type: string;
  data: any;
  created_at: string;
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
    const signature = req.headers.get('mux-signature');

    // Verify signature in production
    if (muxWebhookSecret && signature) {
      if (!verifyMuxSignature(body, signature, muxWebhookSecret)) {
        console.error('Invalid Mux webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers }
        );
      }
    }

    const event: MuxWebhookEvent = JSON.parse(body);
    console.log(`Mux webhook received: ${event.type}`);

    switch (event.type) {
      // Live stream is now active
      case 'video.live_stream.active': {
        const liveStreamId = event.data.id;

        await supabase
          .from('concerts')
          .update({
            status: 'live',
            is_live: true,
            started_at: new Date().toISOString(),
          })
          .eq('mux_live_stream_id', liveStreamId);

        console.log(`Concert is now LIVE: ${liveStreamId}`);
        break;
      }

      // Live stream has ended
      case 'video.live_stream.idle': {
        const liveStreamId = event.data.id;

        await supabase
          .from('concerts')
          .update({
            status: 'ended',
            is_live: false,
            ended_at: new Date().toISOString(),
          })
          .eq('mux_live_stream_id', liveStreamId);

        console.log(`Concert ended: ${liveStreamId}`);
        break;
      }

      // VOD asset created from live stream (replay available)
      case 'video.asset.ready': {
        const asset = event.data;

        // Only process if this is from a live stream (has live_stream_id)
        if (asset.live_stream_id) {
          const playbackId = asset.playback_ids?.[0]?.id;

          await supabase
            .from('concerts')
            .update({
              mux_vod_asset_id: asset.id,
              mux_vod_playback_id: playbackId,
              vod_available: true,
              vod_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            })
            .eq('mux_live_stream_id', asset.live_stream_id);

          console.log(`VOD ready for live stream: ${asset.live_stream_id}`);
        }
        break;
      }

      // Live stream disconnected (temporary)
      case 'video.live_stream.disconnected': {
        const liveStreamId = event.data.id;
        console.log(`Live stream disconnected (will reconnect): ${liveStreamId}`);
        break;
      }

      // Live stream connected
      case 'video.live_stream.connected': {
        const liveStreamId = event.data.id;
        console.log(`Live stream connected: ${liveStreamId}`);
        break;
      }

      // Simulcast target failed
      case 'video.live_stream.simulcast_target.errored': {
        console.error('Simulcast target error:', event.data);
        break;
      }

      default:
        console.log(`Unhandled Mux event: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Mux webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers }
    );
  }
}

export const config = {
  runtime: 'nodejs',
};
