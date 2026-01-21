/**
 * Vybzzz Layout System
 * Consistent spacing, border radius, and layout values
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Layout = {
  // Screen dimensions
  window: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  // Spacing scale (based on 4px grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
    '6xl': 80,
  },

  // Border Radius
  radius: {
    none: 0,
    sm: 5,
    base: 10,
    md: 15,
    lg: 20,
    xl: 25,
    '2xl': 30,
    '3xl': 40,
    full: 9999,
    capsule: 50, // For the unique navigation bar
  },

  // Border Width
  borderWidth: {
    hairline: 0.5,
    thin: 1,
    base: 2,
    thick: 3,
  },

  // Container widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Navigation bar specs
  navBar: {
    height: 80,
    iconSize: 30,
    liveButtonSize: 60,
    bottomOffset: 20,
    horizontalPadding: 20,
  },

  // Card sizes
  card: {
    concertThumbnail: {
      width: 280,
      height: 160,
    },
    concertVertical: {
      width: 160,
      height: 220,
    },
    artistBubble: {
      size: 80,
    },
  },

  // Header heights
  header: {
    heroVideo: 250,
    standard: 60,
  },

  // Z-Index layers
  zIndex: {
    base: 0,
    overlay: 10,
    modal: 100,
    toast: 1000,
    nav: 999,
  },
};

// Helper function to check if screen is small
export const isSmallScreen = SCREEN_WIDTH < 375;
export const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeScreen = SCREEN_WIDTH >= 414;
