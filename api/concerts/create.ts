/**
 * Create Concert Endpoint
 * POST /api/concerts/create
 *
 * Creates a new concert with Mux live stream configuration
 * Includes 7-day replay/VOD automatically
 */

import Mux from '@mux/mux-node';
import { createClient } from '@supabase/supabase-js';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RequestBody {
  title: string;
  description?: string;
  genre: string;
  scheduledAt: string;
  durationMinutes?: number;
  price: number;
  currency?: string;
  thumbnailUrl?: string;
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

    // Verify user is a verified artist
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('id, is_verified, artist_name')
      .eq('user_id', user.id)
      .single();

    if (artistError || !artist?.is_verified) {
      return new Response(
        JSON.stringify({ error: 'You must be a verified artist to create concerts' }),
        { status: 403, headers }
      );
    }

    const body: RequestBody = await req.json();
    const {
      title,
      description,
      genre,
      scheduledAt,
      durationMinutes = 120,
      price,
      currency = 'eur',
      thumbnailUrl,
    } = body;

    // Validate required fields
    if (!title || !genre || !scheduledAt || price === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, genre, scheduledAt, price' }),
        { status: 400, headers }
      );
    }

    // Create Mux Live Stream
    // This automatically creates VOD asset when stream ends (7 days retention by default)
    const liveStream = await mux.video.liveStreams.create({
      playback_policy: ['signed'],
      new_asset_settings: {
        playback_policy: ['signed'],
        // VOD recording enabled - available for 7 days on standard plan
        mp4_support: 'capped-1080p',
      },
      // Reconnect window for stream interruptions
      reconnect_window: 60,
      // Low latency mode for interactive concerts
      latency_mode: 'low',
      // Max continuous duration (4 hours)
      max_continuous_duration: 14400,
    });

    // Create concert in database
    const { data: concert, error: concertError } = await supabase
      .from('concerts')
      .insert({
        artist_id: artist.id,
        title,
        description,
        genre,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
        price,
        currency,
        thumbnail_url: thumbnailUrl,
        mux_playback_id: liveStream.playback_ids?.[0]?.id,
        mux_stream_key: liveStream.stream_key,
        mux_live_stream_id: liveStream.id,
        status: 'scheduled',
        is_live: false,
      })
      .select()
      .single();

    if (concertError) {
      // Cleanup Mux stream if database insert fails
      await mux.video.liveStreams.delete(liveStream.id);
      throw concertError;
    }

    // Return concert data (without sensitive stream key in response)
    return new Response(
      JSON.stringify({
        concert: {
          id: concert.id,
          title: concert.title,
          genre: concert.genre,
          scheduledAt: concert.scheduled_at,
          price: concert.price,
          playbackId: concert.mux_playback_id,
          status: concert.status,
        },
        message: 'Concert created successfully',
      }),
      { status: 201, headers }
    );
  } catch (error: any) {
    console.error('Concert creation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Concert creation failed',
        message: error.message,
      }),
      { status: 500, headers }
    );
  }
}

export const config = {
  runtime: 'edge',
};
