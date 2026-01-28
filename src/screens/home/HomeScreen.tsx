/**
 * HomeScreen
 * Main feed with concerts, featured artists, and recommendations
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '@/hooks/useTheme';
import { ConcertCard, Concert } from '@/components/home/ConcertCard';

// Test concerts with Mux playback IDs
const TEST_CONCERTS: Concert[] = [
  {
    id: '1',
    title: 'Summer Vibes Festival',
    artist: 'DJ Vybz',
    date: '25 janv 2026',
    time: '21:00',
    price: 12,
    genre: 'R&B',
    isLive: true,
    viewers: 1247,
    playbackId: 'c01X6W02WEUNRYGIKNIpouiPPaKHXU01VhgeAjCR2Vrn9w', // Live stream test
  },
  {
    id: '2',
    title: 'Acoustic Sessions',
    artist: 'Luna Nova',
    date: '28 janv 2026',
    time: '20:00',
    price: 15,
    genre: 'Pop',
    isLive: false,
    playbackId: 'Ixf100DM00MIBOSiPjVkEfbToOgso01NuVin19ugUXbjQA', // VOD test
  },
  {
    id: '3',
    title: 'Electro Night Live',
    artist: 'MC Thunder',
    date: '30 janv 2026',
    time: '22:00',
    price: 18,
    genre: 'Electronic',
    isLive: true,
    viewers: 892,
    playbackId: 'c01X6W02WEUNRYGIKNIpouiPPaKHXU01VhgeAjCR2Vrn9w',
  },
];

export const HomeScreen: React.FC = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<any>();

  const handleConcertPress = (concert: Concert) => {
    navigation.navigate('ConcertDetail', {
      concertId: concert.id,
      playbackId: concert.playbackId,
      isLive: concert.isLive,
      title: concert.title,
      artist: concert.artist,
      date: concert.date,
      price: concert.price,
      genre: concert.genre,
      viewers: concert.viewers,
    });
  };

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
    logo: {
      fontSize: theme.typography.fontSize['5xl'],
      fontWeight: '900',
      color: theme.colors.gold,
      letterSpacing: -2,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      marginTop: theme.layout.spacing.sm,
    },
    section: {
      paddingTop: theme.layout.spacing.lg,
    },
    sectionHeader: {
      paddingHorizontal: theme.layout.spacing.xl,
      marginBottom: theme.layout.spacing.base,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '700',
      color: theme.colors.text,
    },
    concertsScrollContainer: {
      paddingHorizontal: theme.layout.spacing.xl,
    },
  });

  const liveConcerts = TEST_CONCERTS.filter((c) => c.isLive);
  const upcomingConcerts = TEST_CONCERTS.filter((c) => !c.isLive);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>VYBZZZ</Text>
          <Text style={styles.subtitle}>
            Concerts live en streaming depuis partout
          </Text>
        </View>

        {/* Live Concerts */}
        {liveConcerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔴 En Direct Maintenant</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.concertsScrollContainer}
            >
              {liveConcerts.map((concert) => (
                <ConcertCard
                  key={concert.id}
                  concert={concert}
                  onPress={() => handleConcertPress(concert)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Upcoming Concerts */}
        {upcomingConcerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📅 Concerts à Venir</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.concertsScrollContainer}
            >
              {upcomingConcerts.map((concert) => (
                <ConcertCard
                  key={concert.id}
                  concert={concert}
                  onPress={() => handleConcertPress(concert)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Concerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Tous les Concerts</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.concertsScrollContainer}
          >
            {TEST_CONCERTS.map((concert) => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                onPress={() => handleConcertPress(concert)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};
