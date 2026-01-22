/**
 * ArtistDashboardScreen
 * Revenue analytics and concert management for artists
 * Shows 70% artist revenue (not the 30% platform commission)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useTheme';
import { calculateArtistPayout, formatCurrency, PRICING } from '@/services/stripe';

// Mock data - will come from Supabase
const MOCK_ARTIST_DATA = {
  artistName: 'DJ Vybz',
  isVerified: true,
  isFounder: false,
  followersCount: 89000,
  totalRevenue: 45000, // Total revenue from all concerts (in cents)
  thisMonthRevenue: 12000, // This month's revenue (in cents)
  concertsCount: 12,
  upcomingConcerts: 3,
  recentConcerts: [
    {
      id: '1',
      title: 'Summer Vibes Festival',
      date: '25 janv 2026',
      viewersCount: 1247,
      revenue: 14964, // cents
    },
    {
      id: '2',
      title: 'Acoustic Sessions',
      date: '20 janv 2026',
      viewersCount: 892,
      revenue: 13380, // cents
    },
    {
      id: '3',
      title: 'Electro Night',
      date: '15 janv 2026',
      viewersCount: 1523,
      revenue: 18276, // cents
    },
  ],
};

export const ArtistDashboardScreen: React.FC = () => {
  const theme = useAppTheme();

  // Calculate artist's 70% share
  const totalPayout = calculateArtistPayout(MOCK_ARTIST_DATA.totalRevenue);
  const thisMonthPayout = calculateArtistPayout(MOCK_ARTIST_DATA.thisMonthRevenue);

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
    greeting: {
      fontSize: theme.typography.fontSize.xl,
      color: theme.colors.textSecondary,
      marginBottom: theme.layout.spacing.xs,
    },
    artistName: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: '900',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.sm,
    },
    stats: {
      flexDirection: 'row',
      gap: theme.layout.spacing.lg,
      marginTop: theme.layout.spacing.md,
    },
    stat: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },

    // Revenue Cards
    revenueSection: {
      padding: theme.layout.spacing.xl,
      paddingTop: 0,
    },
    revenueCards: {
      gap: theme.layout.spacing.md,
    },
    revenueCard: {
      borderRadius: theme.layout.radius.lg,
      overflow: 'hidden',
    },
    revenueGradient: {
      padding: theme.layout.spacing.lg,
    },
    revenueLabel: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.base,
      opacity: 0.9,
      marginBottom: theme.layout.spacing.xs,
    },
    revenueAmount: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize['5xl'],
      fontWeight: '900',
      marginBottom: theme.layout.spacing.sm,
    },
    revenueSplit: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: theme.layout.spacing.sm,
      borderRadius: theme.layout.radius.base,
      alignSelf: 'flex-start',
    },
    revenueSplitText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '700',
    },

    // Quick Actions
    actionsSection: {
      padding: theme.layout.spacing.xl,
      paddingTop: 0,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.base,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.layout.spacing.md,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.lg,
      padding: theme.layout.spacing.lg,
      alignItems: 'center',
      gap: theme.layout.spacing.sm,
    },
    actionIcon: {
      fontSize: 32,
    },
    actionLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },

    // Recent Concerts
    concertsSection: {
      padding: theme.layout.spacing.xl,
      paddingTop: 0,
    },
    concertCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.lg,
      padding: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.md,
    },
    concertHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.layout.spacing.md,
    },
    concertInfo: {
      flex: 1,
    },
    concertTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    concertDate: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    concertRevenue: {
      alignItems: 'flex-end',
    },
    concertRevenueLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    concertRevenueAmount: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '900',
      color: theme.colors.gold,
    },
    concertStats: {
      flexDirection: 'row',
      gap: theme.layout.spacing.xl,
      paddingTop: theme.layout.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    concertStat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.layout.spacing.xs,
    },
    concertStatIcon: {
      fontSize: 16,
    },
    concertStatValue: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.artistName}>
            {MOCK_ARTIST_DATA.artistName} {MOCK_ARTIST_DATA.isVerified && '✓'}
            {MOCK_ARTIST_DATA.isFounder && ' 🏆'}
          </Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {(MOCK_ARTIST_DATA.followersCount / 1000).toFixed(0)}K
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{MOCK_ARTIST_DATA.concertsCount}</Text>
              <Text style={styles.statLabel}>Concerts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{MOCK_ARTIST_DATA.upcomingConcerts}</Text>
              <Text style={styles.statLabel}>À venir</Text>
            </View>
          </View>
        </View>

        {/* Revenue Cards */}
        <View style={styles.revenueSection}>
          <View style={styles.revenueCards}>
            {/* Total Revenue */}
            <TouchableOpacity style={styles.revenueCard} activeOpacity={0.9}>
              <LinearGradient
                colors={['#D4AF37', '#B8941F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.revenueGradient}
              >
                <Text style={styles.revenueLabel}>Vos revenus totaux</Text>
                <Text style={styles.revenueAmount}>
                  {formatCurrency(totalPayout.artistAmount)}
                </Text>
                <View style={styles.revenueSplit}>
                  <Text style={styles.revenueSplitText}>
                    💰 Split {PRICING.REVENUE_SPLIT.ARTIST_PERCENTAGE}% artiste
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* This Month Revenue */}
            <TouchableOpacity style={styles.revenueCard} activeOpacity={0.9}>
              <LinearGradient
                colors={['#E50914', '#B20710']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.revenueGradient}
              >
                <Text style={styles.revenueLabel}>Ce mois-ci</Text>
                <Text style={styles.revenueAmount}>
                  {formatCurrency(thisMonthPayout.artistAmount)}
                </Text>
                <View style={styles.revenueSplit}>
                  <Text style={styles.revenueSplitText}>
                    📈 +24% vs mois dernier
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionIcon}>🎬</Text>
              <Text style={styles.actionLabel}>Créer un concert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionLabel}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionIcon}>💳</Text>
              <Text style={styles.actionLabel}>Paiements</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Concerts */}
        <View style={styles.concertsSection}>
          <Text style={styles.sectionTitle}>Concerts récents</Text>
          {MOCK_ARTIST_DATA.recentConcerts.map((concert) => {
            const concertPayout = calculateArtistPayout(concert.revenue);
            return (
              <TouchableOpacity
                key={concert.id}
                style={styles.concertCard}
                activeOpacity={0.8}
              >
                <View style={styles.concertHeader}>
                  <View style={styles.concertInfo}>
                    <Text style={styles.concertTitle}>{concert.title}</Text>
                    <Text style={styles.concertDate}>{concert.date}</Text>
                  </View>
                  <View style={styles.concertRevenue}>
                    <Text style={styles.concertRevenueLabel}>Vos revenus</Text>
                    <Text style={styles.concertRevenueAmount}>
                      {formatCurrency(concertPayout.artistAmount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.concertStats}>
                  <View style={styles.concertStat}>
                    <Text style={styles.concertStatIcon}>👥</Text>
                    <Text style={styles.concertStatValue}>
                      {concert.viewersCount} spectateurs
                    </Text>
                  </View>
                  <View style={styles.concertStat}>
                    <Text style={styles.concertStatIcon}>💰</Text>
                    <Text style={styles.concertStatValue}>
                      {PRICING.REVENUE_SPLIT.ARTIST_PERCENTAGE}% split
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
