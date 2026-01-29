/**
 * LoginScreen
 * Email/password login with Supabase Auth
 * Includes rate limiting and input validation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, checkRateLimit, resetRateLimit } from '@/utils/validation';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToSignup }) => {
  const theme = useAppTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Rate limiting check (5 attempts per minute)
    const rateLimit = checkRateLimit('login', 5, 60000);
    if (!rateLimit.allowed) {
      const seconds = Math.ceil(rateLimit.resetIn / 1000);
      Alert.alert(
        'Trop de tentatives',
        `Veuillez patienter ${seconds} secondes avant de réessayer.`
      );
      return;
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      Alert.alert('Erreur', emailValidation.error);
      return;
    }

    if (!password.trim()) {
      Alert.alert('Erreur', 'Le mot de passe est requis.');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email.trim().toLowerCase(), password);
    setIsLoading(false);

    if (error) {
      Alert.alert(
        'Erreur de connexion',
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message
      );
    } else {
      // Reset rate limit on successful login
      resetRateLimit('login');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: theme.layout.spacing.xl,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.layout.spacing['4xl'],
    },
    logo: {
      fontSize: theme.typography.fontSize['6xl'],
      fontWeight: '900',
      color: theme.colors.gold,
      letterSpacing: -2,
    },
    tagline: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      marginTop: theme.layout.spacing.sm,
      textAlign: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: '900',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing['2xl'],
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: theme.layout.spacing.base,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: theme.layout.spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.base,
      paddingHorizontal: theme.layout.spacing.base,
      paddingVertical: theme.layout.spacing.md,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputFocused: {
      borderColor: theme.colors.gold,
    },
    buttonContainer: {
      borderRadius: theme.layout.radius.base,
      overflow: 'hidden',
      marginTop: theme.layout.spacing.xl,
    },
    button: {
      paddingVertical: theme.layout.spacing.base,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '900',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.layout.spacing['2xl'],
    },
    switchText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    switchLink: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.gold,
      fontWeight: '700',
      marginLeft: theme.layout.spacing.xs,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>VYBZZZ</Text>
          <Text style={styles.tagline}>The Future of Live Music Streaming</Text>
        </View>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre mot de passe"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.gradients.goldToRed}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={onSwitchToSignup}>
            <Text style={styles.switchLink}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
