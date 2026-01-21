/**
 * Vybzzz Theme Configuration
 * Combines colors, typography, and layout into a unified theme system
 */

import { Colors, ColorScheme } from './colors';
import { Typography, TextStyles } from './typography';
import { Layout } from './layout';

export const getTheme = (colorScheme: ColorScheme) => {
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return {
    colors: {
      ...colors,
      // Dynamic colors based on theme
      primary: isDark ? Colors.shared.red : Colors.shared.gold,
      primaryDark: isDark ? Colors.shared.redDark : Colors.shared.gold,
      surface: isDark ? Colors.dark.gray : Colors.light.gray,
      card: isDark ? Colors.dark.gray : Colors.light.gray,
      accent: Colors.shared.gold,
      // Shared colors
      ...Colors.shared,
    },
    typography: Typography,
    textStyles: TextStyles,
    layout: Layout,
    isDark,
    colorScheme,
  };
};

export type Theme = ReturnType<typeof getTheme>;

// Export constants for direct use
export { Colors, Typography, TextStyles, Layout };
