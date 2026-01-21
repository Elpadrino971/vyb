/**
 * useTheme Hook
 * Provides access to the current theme and theme switching functionality
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { ColorScheme } from '@/constants/colors';
import { getTheme, Theme } from '@/constants/theme';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  // Determine the actual color scheme based on mode
  const getActiveColorScheme = (): ColorScheme => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const activeColorScheme = getActiveColorScheme();
  const theme = getTheme(activeColorScheme);
  const isDark = activeColorScheme === 'dark';

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    isDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Shorthand hook to get just the theme object
export const useAppTheme = (): Theme => {
  const { theme } = useTheme();
  return theme;
};
