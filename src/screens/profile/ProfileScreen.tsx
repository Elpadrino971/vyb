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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme, useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

export const ProfileScreen: React.FC = () => {
  const theme = useAppTheme();
  const { themeMode, setThemeMode } = useTheme();
  const { user, profile, signOut } = useAuth();

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
    avatarInitial: {
      fontSize: 36,
      fontWeight: '900',
      color: theme.colors.white,
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
    roleBadge: {
      marginTop: theme.layout.spacing.sm,
      paddingHorizontal: theme.layout.spacing.md,
      paddingVertical: theme.layout.spacing.xs,
      backgroundColor: theme.colors.gold,
      borderRadius: theme.layout.radius.full,
    },
    roleText: {
      color: theme.colors.black,
      fontWeight: '700',
      fontSize: theme.typography.fontSize.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
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
    logoutButton: {
      marginHorizontal: theme.layout.spacing.xl,
      marginTop: theme.layout.spacing.lg,
      borderRadius: theme.layout.radius.base,
      overflow: 'hidden',
    },
    logoutGradient: {
      paddingVertical: theme.layout.spacing.base,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.base,
      fontWeight: '700',
    },
  });

  const toggleTheme = () => {
    const modes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Utilisateur';
  const displayEmail = user?.email || '';
  const displayRole = profile?.role || 'fan';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{displayRole}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>

          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <Text style={styles.settingLabel}>Thème</Text>
            <Text style={styles.settingValue}>
              {themeMode === 'light' ? 'Clair' : themeMode === 'dark' ? 'Sombre' : 'Auto'}
            </Text>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Langue</Text>
            <Text style={styles.settingValue}>Français</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Activées</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0 (MVP)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#E50914', '#B20710']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
          >
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
