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
import { useAppTheme } from '@/hooks/useTheme';

export const HomeScreen: React.FC = () => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingBottom: theme.layout.navBar.height + theme.layout.navBar.bottomOffset + 20,
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
      padding: theme.layout.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.base,
    },
    placeholder: {
      padding: theme.layout.spacing['2xl'],
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.lg,
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>VYBZZZ</Text>
          <Text style={styles.subtitle}>
            The Future of Live Music Streaming
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔴 En Direct Maintenant</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Live concerts will appear here
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Recommandé Pour Toi</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Recommended concerts based on your taste
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Concerts à Venir</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Upcoming concerts will be listed here
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
