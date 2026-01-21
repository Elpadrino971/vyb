/**
 * Vybzzz - The Future of Live Music Streaming
 * Main App Entry Point
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/hooks/useTheme';
import { MainNavigator } from './src/navigation/MainNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
