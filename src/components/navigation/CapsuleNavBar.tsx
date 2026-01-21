/**
 * CapsuleNavBar Component
 * Unique capsule-shaped navigation bar with elevated central LIVE button
 * Inspired by the specification's glossy, modern design
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CapsuleNavBarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'explore', icon: '🎭', label: 'Explorer' },
  { id: 'live', icon: 'LIVE', label: 'Live', isCentral: true },
  { id: 'tickets', icon: '🎫', label: 'Tickets' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

export const CapsuleNavBar: React.FC<CapsuleNavBarProps> = ({
  activeRoute,
  onNavigate,
}) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: Math.max(insets.bottom, theme.layout.navBar.bottomOffset),
      left: theme.layout.navBar.horizontalPadding,
      right: theme.layout.navBar.horizontalPadding,
      height: theme.layout.navBar.height,
      backgroundColor: theme.colors.glossy.dark,
      borderRadius: theme.layout.radius.capsule,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: theme.layout.spacing.lg,
      borderWidth: theme.layout.borderWidth.thin,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      // Shadow for iOS
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      // Elevation for Android
      elevation: 10,
    },
    navIcon: {
      width: theme.layout.navBar.iconSize + 10,
      height: theme.layout.navBar.iconSize + 10,
      borderRadius: theme.layout.radius.base,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    navIconActive: {
      backgroundColor: theme.colors.gold,
    },
    iconText: {
      fontSize: 20,
    },
    iconTextActive: {
      fontSize: 20,
    },
    liveButtonContainer: {
      position: 'absolute',
      top: -10, // Elevated above nav bar
      left: '50%',
      marginLeft: -theme.layout.navBar.liveButtonSize / 2, // Center (half of width)
      width: theme.layout.navBar.liveButtonSize,
      height: theme.layout.navBar.liveButtonSize,
      borderRadius: theme.layout.navBar.liveButtonSize / 2,
      borderWidth: 3,
      borderColor: theme.colors.background,
      // Shadow for 3D effect
      shadowColor: theme.colors.red,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 15,
    },
    liveGradient: {
      width: '100%',
      height: '100%',
      borderRadius: theme.layout.navBar.liveButtonSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    liveText: {
      color: theme.colors.white,
      fontWeight: '900',
      fontSize: 12,
      letterSpacing: 1,
    },
    // Animation for LIVE button
    livePulse: {
      opacity: 1,
    },
  });

  const renderNavItem = (item: typeof NAV_ITEMS[0]) => {
    if (item.isCentral) {
      // Central LIVE button - elevated and special
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.liveButtonContainer}
          onPress={() => onNavigate(item.id)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.gradients.goldToRed}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.liveGradient}
          >
            <Text style={styles.liveText}>{item.icon}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    // Regular nav items
    const isActive = activeRoute === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.navIcon, isActive && styles.navIconActive]}
        onPress={() => onNavigate(item.id)}
        activeOpacity={0.7}
      >
        <Text style={isActive ? styles.iconTextActive : styles.iconText}>
          {item.icon}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {NAV_ITEMS.filter((item) => !item.isCentral).map(renderNavItem)}
      {/* Render LIVE button separately (positioned absolute) */}
      {NAV_ITEMS.filter((item) => item.isCentral).map(renderNavItem)}
    </View>
  );
};
