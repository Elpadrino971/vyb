/**
 * Mux Service
 * Live streaming and VOD management
 */

import Constants from 'expo-constants';

const muxTokenId = Constants.expoConfig?.extra?.EXPO_PUBLIC_MUX_TOKEN_ID || process.env.EXPO_PUBLIC_MUX_TOKEN_ID;
const muxTokenSecret = Constants.expoConfig?.extra?.EXPO_PUBLIC_MUX_TOKEN_SECRET || process.env.EXPO_PUBLIC_MUX_TOKEN_SECRET;

if (!muxTokenId || !muxTokenSecret) {
  console.warn('Missing Mux credentials. Live streaming features will be limited.');
}

export const MUX_CONFIG = {
  tokenId: muxTokenId,
  tokenSecret: muxTokenSecret,
  baseUrl: 'https://api.mux.com',
};

/**
 * Get HLS playback URL for a Mux asset
 */
export const getMuxPlaybackUrl = (playbackId: string): string => {
  return `https://stream.mux.com/${playbackId}.m3u8`;
};

/**
 * Get thumbnail URL for a Mux asset
 */
export const getMuxThumbnailUrl = (
  playbackId: string,
  options?: {
    width?: number;
    height?: number;
    time?: number;
    fitMode?: 'preserve' | 'crop' | 'smartcrop' | 'pad';
  }
): string => {
  const params = new URLSearchParams();

  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.time !== undefined) params.append('time', options.time.toString());
  if (options?.fitMode) params.append('fit_mode', options.fitMode);

  const queryString = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${queryString ? `?${queryString}` : ''}`;
};

/**
 * Get animated GIF thumbnail
 */
export const getMuxAnimatedThumbnail = (
  playbackId: string,
  options?: {
    width?: number;
    height?: number;
    start?: number;
    end?: number;
    fps?: number;
  }
): string => {
  const params = new URLSearchParams();

  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.start !== undefined) params.append('start', options.start.toString());
  if (options?.end !== undefined) params.append('end', options.end.toString());
  if (options?.fps) params.append('fps', options.fps.toString());

  const queryString = params.toString();
  return `https://image.mux.com/${playbackId}/animated.gif${queryString ? `?${queryString}` : ''}`;
};

/**
 * Create live stream (backend call)
 */
export const createLiveStream = async (concertId: string): Promise<{
  streamId: string;
  streamKey: string;
  playbackId: string;
}> => {
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_RORK_API_BASE_URL || process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  const response = await fetch(`${apiUrl}/api/mux/create-live-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ concertId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create live stream');
  }

  return response.json();
};

/**
 * End live stream (backend call)
 */
export const endLiveStream = async (streamId: string): Promise<void> => {
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_RORK_API_BASE_URL || process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  const response = await fetch(`${apiUrl}/api/mux/end-live-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ streamId }),
  });

  if (!response.ok) {
    throw new Error('Failed to end live stream');
  }
};

/**
 * Get stream status (backend call)
 */
export const getStreamStatus = async (playbackId: string): Promise<{
  status: 'idle' | 'active' | 'disconnected';
  viewerCount?: number;
}> => {
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_RORK_API_BASE_URL || process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  const response = await fetch(`${apiUrl}/api/mux/stream-status?playbackId=${playbackId}`);

  if (!response.ok) {
    throw new Error('Failed to get stream status');
  }

  return response.json();
};

// Test playback IDs (as provided by user)
export const TEST_ASSETS = {
  LIVE_STREAM: 'c01X6W02WEUNRYGIKNIpouiPPaKHXU01VhgeAjCR2Vrn9w',
  VOD_TEST: 'Ixf100DM00MIBOSiPjVkEfbToOgso01NuVin19ugUXbjQA',
};
