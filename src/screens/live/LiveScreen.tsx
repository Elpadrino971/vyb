/**
 * LiveScreen
 * Shows all currently live concerts
 */

import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useAppTheme } from '@/hooks/useTheme';

export const LiveScreen: React.FC = () => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.layout.spacing.xl,
    },
    icon: {
      fontSize: 80,
      marginBottom: theme.layout.spacing.xl,
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: '700',
      color: theme.colors.red,
      marginBottom: theme.layout.spacing.base,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    badge: {
      marginTop: theme.layout.spacing.lg,
      paddingHorizontal: theme.layout.spacing.xl,
      paddingVertical: theme.layout.spacing.md,
      backgroundColor: theme.colors.red,
      borderRadius: theme.layout.radius.full,
    },
    badgeText: {
      color: theme.colors.white,
      fontWeight: '900',
      fontSize: theme.typography.fontSize.sm,
      letterSpacing: 2,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Text style={styles.icon}>🎬</Text>
      <Text style={styles.title}>LIVE Now</Text>
      <Text style={styles.subtitle}>
        Watch concerts happening right now
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🔴 LIVE</Text>
      </View>
    </View>
  );
};
