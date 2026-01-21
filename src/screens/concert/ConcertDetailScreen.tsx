/**
 * ConcertDetailScreen
 * Full concert detail with Mux live stream or VOD player
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
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
    };
  };
}

export const ConcertDetailScreen: React.FC<ConcertDetailScreenProps> = ({ route }) => {
  const theme = useAppTheme();

  // Test data - will be replaced with real data from API
  const concert = {
    id: route?.params?.concertId || '1',
    title: route?.params?.title || 'Summer Vibes Festival',
    artist: route?.params?.artist || 'DJ Vybz',
    date: route?.params?.date || 'dimanche 25 janvier 2026',
    time: '21:00',
    price: route?.params?.price || 12,
    playbackId: route?.params?.playbackId || 'c01X6W02WEUNRYGIKNIpouiPPaKHXU01VhgeAjCR2Vrn9w',
    isLive: route?.params?.isLive || true,
    genre: 'R&B',
    viewers: 1247,
    description: 'Une soirée intimiste avec DJ Vybz pour célébrer l\'été. Ne manquez pas cet événement exclusif en direct depuis la plage de Miami.',
  };

  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(
    SCREEN_HEIGHT > SCREEN_WIDTH ? 'portrait' : 'landscape'
  );

  const aspectRatio = orientation === 'portrait' ? 9 / 16 : 16 / 9;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    playerContainer: {
      width: '100%',
      backgroundColor: theme.colors.black,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: {
      color: theme.colors.white,
      fontSize: 20,
    },
    liveIndicator: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.red,
      borderRadius: theme.layout.radius.full,
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
      fontSize: 12,
      letterSpacing: 1,
    },
    viewersText: {
      color: theme.colors.white,
      fontSize: 12,
      marginLeft: 4,
    },
    contentContainer: {
      padding: theme.layout.spacing.xl,
      paddingBottom: theme.layout.navBar.height + theme.layout.navBar.bottomOffset + 40,
    },
    genre: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.layout.spacing.md,
      paddingVertical: theme.layout.spacing.xs,
      backgroundColor: theme.colors.gold,
      borderRadius: theme.layout.radius.full,
      marginBottom: theme.layout.spacing.base,
    },
    genreText: {
      color: theme.colors.black,
      fontWeight: '700',
      fontSize: theme.typography.fontSize.xs,
      textTransform: 'uppercase',
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: '900',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.sm,
    },
    artistContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.layout.spacing.lg,
    },
    artistAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.gold,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.layout.spacing.md,
    },
    artistEmoji: {
      fontSize: 24,
    },
    artistName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
    },
    artistFollowers: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    infoRow: {
      flexDirection: 'row',
      gap: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.xl,
    },
    infoCard: {
      flex: 1,
      padding: theme.layout.spacing.base,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.md,
      alignItems: 'center',
    },
    infoIcon: {
      fontSize: 24,
      marginBottom: theme.layout.spacing.xs,
    },
    infoLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: '700',
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.sm,
    },
    description: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
      marginBottom: theme.layout.spacing.xl,
    },
    buyButton: {
      borderRadius: theme.layout.radius.lg,
      overflow: 'hidden',
      marginTop: theme.layout.spacing.lg,
    },
    buyGradient: {
      paddingVertical: theme.layout.spacing.lg,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.layout.spacing.sm,
    },
    buyButtonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '900',
    },
    priceText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '900',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.black} />

      {/* Video Player */}
      <View style={styles.playerContainer}>
        <MuxPlayer
          playbackId={concert.playbackId}
          autoPlay={concert.isLive}
          isLive={concert.isLive}
          aspectRatio={aspectRatio}
        />

        {/* Back Button Overlay */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Live Indicator */}
        {concert.isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
            <Text style={styles.viewersText}>{concert.viewers} spectateurs</Text>
          </View>
        )}
      </View>

      {/* Concert Info */}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.genre}>
          <Text style={styles.genreText}>{concert.genre}</Text>
        </View>

        <Text style={styles.title}>{concert.title}</Text>

        <View style={styles.artistContainer}>
          <View style={styles.artistAvatar}>
            <Text style={styles.artistEmoji}>🎧</Text>
          </View>
          <View>
            <Text style={styles.artistName}>{concert.artist} ✓</Text>
            <Text style={styles.artistFollowers}>89 000 followers</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{concert.date}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🕐</Text>
            <Text style={styles.infoLabel}>Heure</Text>
            <Text style={styles.infoValue}>{concert.time}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{concert.description}</Text>

        {/* Buy Ticket Button */}
        <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
          <LinearGradient
            colors={theme.colors.gradients.goldToRed}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buyGradient}
          >
            <Text style={styles.buyButtonText}>Acheter le billet</Text>
            <Text style={styles.priceText}>{concert.price}€</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
