/**
 * SearchScreen
 * Search concerts, artists, and genres
 */

import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useAppTheme } from '@/hooks/useTheme';

export const SearchScreen: React.FC = () => {
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
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.base,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.subtitle}>
        Find concerts, artists, and genres
      </Text>
    </View>
  );
};
