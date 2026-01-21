/**
 * MuxPlayer Component
 * Video player for Mux live streams and VOD using expo-av
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useAppTheme } from '@/hooks/useTheme';

interface MuxPlayerProps {
  playbackId: string; // Mux playback ID
  autoPlay?: boolean;
  muted?: boolean;
  isLive?: boolean;
  aspectRatio?: number; // 16/9 = 1.78, 9/16 = 0.56, etc.
}

export const MuxPlayer: React.FC<MuxPlayerProps> = ({
  playbackId,
  autoPlay = false,
  muted = false,
  isLive = false,
  aspectRatio = 16 / 9, // Default to landscape
}) => {
  const theme = useAppTheme();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Construct Mux HLS URL
  const videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      aspectRatio,
      backgroundColor: theme.colors.black,
      borderRadius: theme.layout.radius.base,
      overflow: 'hidden',
      position: 'relative',
    },
    video: {
      width: '100%',
      height: '100%',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    controlsOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.layout.spacing.base,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.gold,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButtonText: {
      fontSize: 20,
      color: theme.colors.white,
    },
    liveBadge: {
      paddingHorizontal: theme.layout.spacing.md,
      paddingVertical: theme.layout.spacing.xs,
      backgroundColor: theme.colors.red,
      borderRadius: theme.layout.radius.full,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.white,
    },
    liveText: {
      color: theme.colors.white,
      fontWeight: '900',
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1,
    },
    errorContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.black,
      padding: theme.layout.spacing.xl,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
    },
  });

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
    } else if (status.error) {
      setError(status.error);
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isMuted={muted}
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        useNativeControls={false} // We'll use custom controls
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.gold} />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Erreur de chargement de la vidéo{'\n'}
            {error}
          </Text>
        </View>
      )}

      {!isLoading && !error && (
        <View style={styles.controlsOverlay}>
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
