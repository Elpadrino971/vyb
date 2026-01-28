/**
 * AuthNavigator
 * Shows Login/Signup when not authenticated, MainNavigator when authenticated
 */

import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useAppTheme } from '@/hooks/useTheme';
import { MainNavigator } from './MainNavigator';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';

export const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const theme = useAppTheme();
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.gold} />
      </View>
    );
  }

  if (!isAuthenticated) {
    if (authScreen === 'login') {
      return <LoginScreen onSwitchToSignup={() => setAuthScreen('signup')} />;
    }
    return <SignupScreen onSwitchToLogin={() => setAuthScreen('login')} />;
  }

  return <MainNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
