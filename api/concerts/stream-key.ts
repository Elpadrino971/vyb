/**
 * Get Stream Key Endpoint
 * GET /api/concerts/stream-key/:concertId
 *
 * Returns the Mux stream key for a concert (artist only)
 * This is sensitive data - only the concert owner can access it
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Get concert ID from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const concertId = pathParts[pathParts.length - 1];

    if (!concertId) {
      return new Response(
        JSON.stringify({ error: 'Missing concert ID' }),
        { status: 400, headers }
      );
    }

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

    // Get concert with artist info
    const { data: concert, error: concertError } = await supabase
      .from('concerts')
      .select(`
        id,
        mux_stream_key,
        mux_playback_id,
        status,
        artist_id,
        artists!inner (
          user_id
        )
      `)
      .eq('id', concertId)
      .single();

    if (concertError || !concert) {
      return new Response(
        JSON.stringify({ error: 'Concert not found' }),
        { status: 404, headers }
      );
    }

    // Verify user is the artist who owns this concert
    const artistData = concert.artists as any;
    if (artistData.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You are not authorized to access this stream key' }),
        { status: 403, headers }
      );
    }

    // Return stream configuration
    return new Response(
      JSON.stringify({
        streamKey: concert.mux_stream_key,
        playbackId: concert.mux_playback_id,
        rtmpUrl: 'rtmps://global-live.mux.com:443/app',
        status: concert.status,
        instructions: {
          obs: {
            server: 'rtmps://global-live.mux.com:443/app',
            streamKey: concert.mux_stream_key,
          },
          recommended: {
            resolution: '1920x1080',
            bitrate: '4500 kbps',
            framerate: '30 fps',
            keyframeInterval: '2 seconds',
            encoder: 'x264 or NVENC',
          },
        },
      }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Stream key error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get stream key' }),
      { status: 500, headers }
    );
  }
}

export const config = {
  runtime: 'edge',
};
