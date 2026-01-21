/**
 * Vybzzz Typography System
 * Font family: Inter (system fallback on native)
 */

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    black: 'System',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 42,
    '6xl': 60,
    '7xl': 80,
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  } as const,

  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.8,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -2,
    tight: -1,
    normal: 0,
    wide: 1,
    wider: 2,
  },
};

// Predefined text styles
export const TextStyles = {
  // Headings
  h1: {
    fontSize: Typography.fontSize['6xl'],
    fontWeight: Typography.fontWeight.black,
    lineHeight: Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.tighter,
  },
  h2: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.extrabold,
    lineHeight: Typography.lineHeight.tight,
  },
  h3: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.snug,
  },
  h4: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.snug,
  },
  h5: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.normal,
  },
  h6: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.normal,
  },

  // Body
  bodyLarge: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.relaxed,
  },
  body: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.normal,
  },
  bodySmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.normal,
  },

  // Captions
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.normal,
  },
  captionBold: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.normal,
  },

  // Buttons
  button: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.tight,
  },
  buttonLarge: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.tight,
  },

  // Labels
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.wide,
  },
};
