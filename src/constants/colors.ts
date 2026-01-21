/**
 * Vybzzz Color System
 * Based on dual-theme design (Light Mode for day, Dark Mode for night)
 */

export const Colors = {
  // Light Theme (Jour)
  light: {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    gold: '#D4AF37',
    goldLight: '#F5E6C8',
    gray: '#F5F5F5',
    grayDark: '#CCCCCC',
    border: 'rgba(212, 175, 55, 0.2)',
  },

  // Dark Theme (Nuit)
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    red: '#E50914',
    redDark: '#B20710',
    gray: '#1A1A1A',
    grayLight: '#333333',
    border: 'rgba(212, 175, 55, 0.2)',
  },

  // Shared Colors (work across both themes)
  shared: {
    gold: '#D4AF37',
    goldLight: '#F5E6C8',
    red: '#E50914',
    redDark: '#B20710',
    success: '#22C55E',
    successLight: '#86EFAC',
    warning: '#EAB308',
    warningLight: '#FDE047',
    error: '#EF4444',
    errorLight: '#FCA5A5',
    transparent: 'transparent',
    white: '#FFFFFF',
    black: '#000000',
  },

  // Glossy effects
  glossy: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.8)',
  },

  // Gradients
  gradients: {
    goldToRed: ['#D4AF37', '#E50914'],
    blackTransparent: ['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)'],
  },
};

export type ColorScheme = 'light' | 'dark';
