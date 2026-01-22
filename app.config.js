import 'dotenv/config';

export default {
  expo: {
    name: 'Vybzzz',
    slug: 'vybzzz',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: false, // Disabled due to strict type validation issues
    scheme: 'vybzzz',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'app.vybzzz.mobile',
      infoPlist: {
        NSCameraUsageDescription: 'Vybzzz needs access to your camera to scan QR codes.',
        NSMicrophoneUsageDescription: 'Vybzzz needs access to your microphone for live interactions.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#000000',
      },
      package: 'app.vybzzz.mobile',
      permissions: ['CAMERA', 'RECORD_AUDIO'],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-av'],
    extra: {
      eas: {
        projectId: 'your-eas-project-id',
      },
      // Environment variables
      EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      EXPO_PUBLIC_RORK_API_BASE_URL: process.env.EXPO_PUBLIC_RORK_API_BASE_URL,
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_MUX_TOKEN_ID: process.env.EXPO_PUBLIC_MUX_TOKEN_ID,
      EXPO_PUBLIC_MUX_TOKEN_SECRET: process.env.EXPO_PUBLIC_MUX_TOKEN_SECRET,
      EXPO_PUBLIC_APP_URL: process.env.EXPO_PUBLIC_APP_URL,
    },
  },
};
