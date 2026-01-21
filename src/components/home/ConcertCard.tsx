/**
 * ConcertCard Component
 * Displays a concert with thumbnail, artist, and details
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useTheme';

export interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  price: number;
  genre: string;
  isLive: boolean;
  viewers?: number;
  playbackId: string;
  thumbnailUrl?: string;
}

interface ConcertCardProps {
  concert: Concert;
  onPress: () => void;
}

export const ConcertCard: React.FC<ConcertCardProps> = ({ concert, onPress }) => {
  const theme = useAppTheme();

  // Mux thumbnail URL
  const thumbnailUrl =
    concert.thumbnailUrl ||
    `https://image.mux.com/${concert.playbackId}/thumbnail.jpg?width=640&height=360&time=0`;

  const styles = StyleSheet.create({
    container: {
      width: theme.layout.card.concertThumbnail.width,
      height: theme.layout.card.concertThumbnail.height,
      borderRadius: theme.layout.radius.lg,
      overflow: 'hidden',
      marginRight: theme.layout.spacing.md,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    gradient: {
      padding: theme.layout.spacing.md,
    },
    liveBadge: {
      position: 'absolute',
      top: theme.layout.spacing.md,
      left: theme.layout.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.layout.spacing.sm,
      paddingVertical: theme.layout.spacing.xs,
      backgroundColor: theme.colors.red,
      borderRadius: theme.layout.radius.full,
      gap: 4,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.white,
    },
    liveText: {
      color: theme.colors.white,
      fontWeight: '900',
      fontSize: 10,
      letterSpacing: 0.5,
    },
    viewersText: {
      color: theme.colors.white,
      fontSize: 10,
      marginLeft: 2,
    },
    genre: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.layout.spacing.sm,
      paddingVertical: 2,
      backgroundColor: theme.colors.gold,
      borderRadius: theme.layout.radius.sm,
      marginBottom: theme.layout.spacing.xs,
    },
    genreText: {
      color: theme.colors.black,
      fontWeight: '700',
      fontSize: 10,
      textTransform: 'uppercase',
    },
    title: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: '700',
      color: theme.colors.white,
      marginBottom: 2,
    },
    artist: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.white,
      opacity: 0.9,
      marginBottom: theme.layout.spacing.xs,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    date: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.white,
      opacity: 0.8,
    },
    price: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: '900',
      color: theme.colors.gold,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground source={{ uri: thumbnailUrl }} style={styles.thumbnail} resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          {concert.isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
              {concert.viewers && <Text style={styles.viewersText}>{concert.viewers}</Text>}
            </View>
          )}

          <View style={styles.genre}>
            <Text style={styles.genreText}>{concert.genre}</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {concert.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {concert.artist}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.date}>{concert.date}</Text>
            <Text style={styles.price}>{concert.price}€</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};
