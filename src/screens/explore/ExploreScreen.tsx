/**
 * ExploreScreen
 * Discover concerts by genres, top artists, and trending performances
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '@/hooks/useTheme';

const GENRES = [
  { id: '1', name: 'R&B', emoji: '🎵', color: '#D4AF37' },
  { id: '2', name: 'Hip-Hop', emoji: '🎤', color: '#E50914' },
  { id: '3', name: 'Pop', emoji: '⭐', color: '#1DB954' },
  { id: '4', name: 'Rock', emoji: '🎸', color: '#FF6B6B' },
  { id: '5', name: 'Jazz', emoji: '🎷', color: '#4ECDC4' },
  { id: '6', name: 'Electronic', emoji: '🎧', color: '#9B59B6' },
];

export const ExploreScreen: React.FC = () => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.layout.navBar.height + theme.layout.navBar.bottomOffset + 40,
    },
    header: {
      padding: theme.layout.spacing.xl,
      paddingTop: theme.layout.spacing['5xl'],
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: '900',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    section: {
      padding: theme.layout.spacing.xl,
      paddingTop: theme.layout.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.base,
    },
    genresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.layout.spacing.md,
    },
    genreCard: {
      width: '47%',
      aspectRatio: 1.5,
      borderRadius: theme.layout.radius.lg,
      padding: theme.layout.spacing.lg,
      justifyContent: 'space-between',
      marginBottom: theme.layout.spacing.md,
    },
    genreEmoji: {
      fontSize: 40,
    },
    genreName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.white,
    },
    topArtistsContainer: {
      flexDirection: 'row',
      gap: theme.layout.spacing.md,
    },
    artistCard: {
      width: 140,
      alignItems: 'center',
    },
    artistAvatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.gold,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.layout.spacing.sm,
      borderWidth: 3,
      borderColor: theme.colors.gold,
    },
    artistEmoji: {
      fontSize: 40,
    },
    artistName: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    artistFollowers: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    badge: {
      fontSize: 10,
      marginLeft: 2,
    },
  });

  const renderGenreCard = (genre: typeof GENRES[0]) => (
    <TouchableOpacity
      key={genre.id}
      style={[styles.genreCard, { backgroundColor: genre.color }]}
      activeOpacity={0.8}
    >
      <Text style={styles.genreEmoji}>{genre.emoji}</Text>
      <Text style={styles.genreName}>{genre.name}</Text>
    </TouchableOpacity>
  );

  const topArtists = [
    { id: '1', name: 'DJ Vybz', followers: '89K', verified: true, emoji: '🎧' },
    { id: '2', name: 'Luna Nova', followers: '145K', verified: true, emoji: '🌙' },
    { id: '3', name: 'MC Thunder', followers: '67K', verified: false, emoji: '⚡' },
    { id: '4', name: 'Tropical Soul', followers: '201K', verified: true, emoji: '🌴' },
  ];

  const renderArtistCard = (artist: typeof topArtists[0]) => (
    <View key={artist.id} style={styles.artistCard}>
      <View style={styles.artistAvatar}>
        <Text style={styles.artistEmoji}>{artist.emoji}</Text>
      </View>
      <Text style={styles.artistName}>
        {artist.name} {artist.verified && <Text style={styles.badge}>✓</Text>}
      </Text>
      <Text style={styles.artistFollowers}>{artist.followers} followers</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Explorer</Text>
          <Text style={styles.subtitle}>
            Découvrez de nouveaux concerts et artistes
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 Genres Musicaux</Text>
          <View style={styles.genresGrid}>
            {GENRES.map(renderGenreCard)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Artistes Populaires</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topArtistsContainer}
          >
            {topArtists.map(renderArtistCard)}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};
