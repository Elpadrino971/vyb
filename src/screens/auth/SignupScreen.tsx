/**
 * SignupScreen
 * User registration with Supabase Auth
 * Includes input validation and security measures
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
import {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeName,
  checkRateLimit,
} from '@/utils/validation';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onSwitchToLogin }) => {
  const theme = useAppTheme();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Rate limiting check (5 attempts per minute)
    const rateLimit = checkRateLimit('signup', 5, 60000);
    if (!rateLimit.allowed) {
      const seconds = Math.ceil(rateLimit.resetIn / 1000);
      Alert.alert(
        'Trop de tentatives',
        `Veuillez patienter ${seconds} secondes avant de réessayer.`
      );
      return;
    }

    // Validate name
    const nameValidation = validateName(fullName);
    if (!nameValidation.valid) {
      Alert.alert('Erreur', nameValidation.error);
      return;
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      Alert.alert('Erreur', emailValidation.error);
      return;
    }

    // Validate password strength (min 8 chars, uppercase, lowercase, number)
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      Alert.alert('Erreur', passwordValidation.error);
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    const sanitizedName = sanitizeName(fullName);
    const { error } = await signUp(email.trim().toLowerCase(), password, sanitizedName);
    setIsLoading(false);

    if (error) {
      let message = error.message;
      if (message.includes('already registered')) {
        message = 'Cet email est déjà utilisé. Essayez de vous connecter.';
      }
      Alert.alert('Erreur d\'inscription', message);
    } else {
      Alert.alert(
        'Inscription réussie !',
        'Votre compte a été créé. Vérifiez votre email pour confirmer votre inscription, ou connectez-vous directement.',
        [{ text: 'OK' }]
      );
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
      marginBottom: theme.layout.spacing['3xl'],
    },
    logo: {
      fontSize: theme.typography.fontSize['5xl'],
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
    termsText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.layout.spacing.lg,
      lineHeight: 18,
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
          <Text style={styles.tagline}>Rejoignez la communauté</Text>
        </View>

        <Text style={styles.title}>Créer un compte</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor={theme.colors.textSecondary}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

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
            placeholder="Min. 8 car., majuscule, minuscule, chiffre"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Retapez votre mot de passe"
            placeholderTextColor={theme.colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSignup}
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
              <Text style={styles.buttonText}>Créer mon compte</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          En créant un compte, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité.
        </Text>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.switchLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
