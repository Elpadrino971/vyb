/**
 * ProfileScreen
 * User profile, settings, and preferences (Netflix style)
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
import { useAppTheme, useTheme } from '@/hooks/useTheme';

export const ProfileScreen: React.FC = () => {
  const theme = useAppTheme();
  const { themeMode, setThemeMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.layout.navBar.height + theme.layout.navBar.bottomOffset + 40,
    },
    header: {
      alignItems: 'center',
      padding: theme.layout.spacing['3xl'],
      paddingTop: theme.layout.spacing['5xl'],
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.gold,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.layout.spacing.base,
    },
    avatarText: {
      fontSize: 40,
    },
    name: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.xs,
    },
    email: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    section: {
      padding: theme.layout.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      marginBottom: theme.layout.spacing.base,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.layout.spacing.base,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.base,
      marginBottom: theme.layout.spacing.sm,
    },
    settingLabel: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
    },
    settingValue: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.gold,
      fontWeight: '600',
    },
  });

  const toggleTheme = () => {
    const modes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>Guest User</Text>
          <Text style={styles.email}>guest@vybzzz.app</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Text style={styles.settingValue}>
              {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
            </Text>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingValue}>Français</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Enabled</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0 (MVP)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
