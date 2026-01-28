/**
 * MuxPlayer Component
 * Fullscreen video player for Mux live streams and VOD using expo-av
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useAppTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MuxPlayerProps {
  playbackId: string;
  autoPlay?: boolean;
  muted?: boolean;
  isLive?: boolean;
  fullscreen?: boolean;
}

export const MuxPlayer: React.FC<MuxPlayerProps> = ({
  playbackId,
  autoPlay = false,
  muted = false,
  isLive = false,
  fullscreen = false,
}) => {
  const theme = useAppTheme();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Construct Mux HLS URL
  const videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  const scheduleHideControls = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleTapVideo = () => {
    setShowControls(true);
    scheduleHideControls();
  };

  const styles = StyleSheet.create({
    container: {
      width: fullscreen ? SCREEN_WIDTH : '100%',
      height: fullscreen ? SCREEN_HEIGHT : undefined,
      aspectRatio: fullscreen ? undefined : 16 / 9,
      backgroundColor: '#000000',
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
      bottom: fullscreen ? 120 : 0,
      left: 0,
      right: 0,
      padding: theme.layout.spacing.lg,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.layout.spacing.lg,
    },
    centerPlayButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -35,
      marginLeft: -35,
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(212, 175, 55, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerPlayButtonText: {
      fontSize: 28,
      color: '#FFFFFF',
      marginLeft: 4,
    },
    liveBadge: {
      position: 'absolute',
      top: fullscreen ? 60 : 16,
      right: 16,
      paddingHorizontal: theme.layout.spacing.md,
      paddingVertical: theme.layout.spacing.xs,
      backgroundColor: theme.colors.red,
      borderRadius: theme.layout.radius.full,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      zIndex: 10,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
    },
    liveText: {
      color: '#FFFFFF',
      fontWeight: '900',
      fontSize: 12,
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
      backgroundColor: '#000000',
      padding: theme.layout.spacing.xl,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.base,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: theme.layout.spacing.base,
      paddingHorizontal: theme.layout.spacing.xl,
      paddingVertical: theme.layout.spacing.sm,
      backgroundColor: theme.colors.gold,
      borderRadius: theme.layout.radius.base,
    },
    retryText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: theme.typography.fontSize.base,
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
        setShowControls(true);
      } else {
        await videoRef.current.playAsync();
        scheduleHideControls();
      }
    }
  };

  const handleRetry = async () => {
    setError(null);
    setIsLoading(true);
    if (videoRef.current) {
      try {
        await videoRef.current.unloadAsync();
        await videoRef.current.loadAsync({ uri: videoUrl }, {}, false);
        await videoRef.current.playAsync();
      } catch (e) {
        setError('Impossible de charger la vidéo');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && showControls) {
      scheduleHideControls();
    }
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [isPlaying, showControls]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleTapVideo}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={fullscreen ? ResizeMode.COVER : ResizeMode.CONTAIN}
          shouldPlay={autoPlay}
          isMuted={muted}
          isLooping={!isLive}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          useNativeControls={false}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.gold} />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Erreur de chargement de la vidéo
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}

        {!isLoading && !error && showControls && !isPlaying && (
          <TouchableOpacity style={styles.centerPlayButton} onPress={togglePlayPause}>
            <Text style={styles.centerPlayButtonText}>▶</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
