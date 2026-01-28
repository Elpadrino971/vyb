/**
 * ConcertDetailScreen
 * Fullscreen immersive concert experience with video player
 * Video fills the entire screen with concert info overlaid
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '@/hooks/useTheme';
import { MuxPlayer } from '@/components/live/MuxPlayer';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConcertDetailScreenProps {
  route?: {
    params?: {
      concertId?: string;
      playbackId?: string;
      isLive?: boolean;
      title?: string;
      artist?: string;
      date?: string;
      price?: number;
      genre?: string;
      viewers?: number;
    };
  };
  navigation?: any;
}

export const ConcertDetailScreen: React.FC<ConcertDetailScreenProps> = ({ route, navigation }) => {
  const theme = useAppTheme();
  const [showDetails, setShowDetails] = useState(false);

  const concert = {
    id: route?.params?.concertId || '1',
    title: route?.params?.title || 'Summer Vibes Festival',
    artist: route?.params?.artist || 'DJ Vybz',
    date: route?.params?.date || 'dimanche 25 janvier 2026',
    time: '21:00',
    price: route?.params?.price || 12,
    playbackId: route?.params?.playbackId || 'c01X6W02WEUNRYGIKNIpouiPPaKHXU01VhgeAjCR2Vrn9w',
    isLive: route?.params?.isLive || true,
    genre: route?.params?.genre || 'R&B',
    viewers: route?.params?.viewers || 1247,
    description: 'Une soirée intimiste avec DJ Vybz pour célébrer l\'été. Ne manquez pas cet événement exclusif en direct depuis la plage de Miami.',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    // Fullscreen video - takes entire screen
    fullscreenPlayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
    // Overlay controls on top of video
    overlayContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
    },
    // Top bar: back button + live indicator
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 56,
      paddingHorizontal: 20,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '600',
    },
    liveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 7,
      backgroundColor: '#E50914',
      borderRadius: 20,
      gap: 6,
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
      fontSize: 13,
      letterSpacing: 1,
    },
    viewersText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 2,
    },
    // Bottom overlay with gradient + concert info
    bottomOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    bottomGradient: {
      paddingHorizontal: 24,
      paddingBottom: 40,
      paddingTop: 100,
    },
    genreBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: '#D4AF37',
      borderRadius: 12,
      marginBottom: 12,
    },
    genreText: {
      color: '#000000',
      fontWeight: '700',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    concertTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#FFFFFF',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    artistRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    artistAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#D4AF37',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    artistEmoji: {
      fontSize: 20,
    },
    artistName: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    artistFollowers: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 20,
    },
    infoPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 16,
      gap: 6,
    },
    infoText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    // Buy button at bottom
    buyButton: {
      borderRadius: 16,
      overflow: 'hidden',
    },
    buyGradient: {
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
    },
    buyButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '900',
    },
    priceText: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '900',
    },
    // Details sheet
    detailsButton: {
      alignSelf: 'center',
      paddingVertical: 8,
      marginBottom: 8,
    },
    detailsButtonText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 13,
      fontWeight: '600',
    },
    // Details panel (when expanded)
    detailsPanel: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: SCREEN_HEIGHT * 0.6,
      backgroundColor: 'rgba(0, 0, 0, 0.92)',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      zIndex: 20,
    },
    detailsHandle: {
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 8,
    },
    detailsHandleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    detailsContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    detailsTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    detailsArtist: {
      fontSize: 16,
      color: '#D4AF37',
      fontWeight: '700',
      marginBottom: 16,
    },
    detailsInfoRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 20,
    },
    detailsInfoCard: {
      flex: 1,
      padding: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      alignItems: 'center',
    },
    detailsInfoIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    detailsInfoLabel: {
      fontSize: 11,
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: 2,
    },
    detailsInfoValue: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    descriptionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    descriptionText: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Fullscreen Video Player */}
      <View style={styles.fullscreenPlayer}>
        <MuxPlayer
          playbackId={concert.playbackId}
          autoPlay={concert.isLive}
          isLive={concert.isLive}
          fullscreen
        />
      </View>

      {/* Overlay UI */}
      <View style={styles.overlayContainer}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
          >
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>

          {concert.isLive && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
              <Text style={styles.viewersText}>{concert.viewers.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Bottom Concert Info Overlay */}
        <View style={styles.bottomOverlay}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
            style={styles.bottomGradient}
          >
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{concert.genre}</Text>
            </View>

            <Text style={styles.concertTitle}>{concert.title}</Text>

            <View style={styles.artistRow}>
              <View style={styles.artistAvatar}>
                <Text style={styles.artistEmoji}>🎧</Text>
              </View>
              <View>
                <Text style={styles.artistName}>{concert.artist}</Text>
                <Text style={styles.artistFollowers}>89 000 followers</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoPill}>
                <Text style={styles.infoText}>📅 {concert.date}</Text>
              </View>
              <View style={styles.infoPill}>
                <Text style={styles.infoText}>🕐 {concert.time}</Text>
              </View>
            </View>

            {/* Details toggle */}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Text style={styles.detailsButtonText}>
                {showDetails ? 'Masquer les détails' : 'Voir les détails'}
              </Text>
            </TouchableOpacity>

            {/* Buy Ticket Button */}
            <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#D4AF37', '#E50914']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buyGradient}
              >
                <Text style={styles.buyButtonText}>Acheter le billet</Text>
                <Text style={styles.priceText}>{concert.price}€</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Expandable Details Panel */}
      {showDetails && (
        <View style={styles.detailsPanel}>
          <TouchableOpacity
            style={styles.detailsHandle}
            onPress={() => setShowDetails(false)}
          >
            <View style={styles.detailsHandleBar} />
          </TouchableOpacity>
          <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.detailsTitle}>{concert.title}</Text>
            <Text style={styles.detailsArtist}>{concert.artist}</Text>

            <View style={styles.detailsInfoRow}>
              <View style={styles.detailsInfoCard}>
                <Text style={styles.detailsInfoIcon}>📅</Text>
                <Text style={styles.detailsInfoLabel}>Date</Text>
                <Text style={styles.detailsInfoValue}>{concert.date}</Text>
              </View>
              <View style={styles.detailsInfoCard}>
                <Text style={styles.detailsInfoIcon}>🕐</Text>
                <Text style={styles.detailsInfoLabel}>Heure</Text>
                <Text style={styles.detailsInfoValue}>{concert.time}</Text>
              </View>
              <View style={styles.detailsInfoCard}>
                <Text style={styles.detailsInfoIcon}>👥</Text>
                <Text style={styles.detailsInfoLabel}>Spectateurs</Text>
                <Text style={styles.detailsInfoValue}>{concert.viewers.toLocaleString()}</Text>
              </View>
            </View>

            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{concert.description}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};
