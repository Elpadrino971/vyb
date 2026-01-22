/**
 * BecomeProScreen
 * Pro subscription at 59€/month with Founder badge offer
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useTheme';
import { PRICING, createProSubscription, formatCurrency } from '@/services/stripe';

interface BecomeProScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BecomeProScreen: React.FC<BecomeProScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const theme = useAppTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundersRemaining] = useState(12); // Mock data - will come from backend

  const handleSubscribe = async (isFounder: boolean = false) => {
    setIsProcessing(true);

    try {
      // Mock user ID - will come from auth context
      const userId = 'mock-user-id';

      const { clientSecret, subscriptionId } = await createProSubscription(
        userId,
        isFounder
      );

      // Here you would integrate with Stripe's payment sheet
      Alert.alert(
        'Bienvenue chez les Pros ! 🎉',
        isFounder
          ? `Vous êtes maintenant un artiste Founder!\n\n🏆 Badge exclusif activé\n💎 Premium à vie\n\nCommencez à créer vos concerts dès maintenant.`
          : `Vous êtes maintenant un artiste Pro!\n\n✅ Abonnement activé\n\nCommencez à créer vos concerts dès maintenant.`,
        [
          {
            text: 'Créer mon premier concert',
            onPress: () => onSuccess?.(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.layout.spacing['6xl'],
    },
    header: {
      padding: theme.layout.spacing.xl,
      paddingTop: theme.layout.spacing['5xl'],
      alignItems: 'center',
    },
    badge: {
      fontSize: 60,
      marginBottom: theme.layout.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: '900',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.layout.spacing.xl,
    },

    // Founder Banner
    founderBanner: {
      margin: theme.layout.spacing.xl,
      marginTop: 0,
      borderRadius: theme.layout.radius.lg,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: theme.colors.gold,
    },
    founderGradient: {
      padding: theme.layout.spacing.lg,
    },
    founderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.layout.spacing.md,
      gap: theme.layout.spacing.sm,
    },
    founderBadgeIcon: {
      fontSize: 32,
    },
    founderTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '900',
      color: theme.colors.white,
    },
    founderDescription: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.white,
      opacity: 0.9,
      marginBottom: theme.layout.spacing.md,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    },
    founderLimited: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: theme.layout.spacing.sm,
      borderRadius: theme.layout.radius.base,
      marginBottom: theme.layout.spacing.md,
    },
    founderLimitedText: {
      color: theme.colors.white,
      fontWeight: '700',
      fontSize: theme.typography.fontSize.sm,
    },
    founderFeatures: {
      gap: theme.layout.spacing.sm,
    },
    founderFeature: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.layout.spacing.sm,
    },
    founderFeatureText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.base,
      fontWeight: '600',
    },
    founderPrice: {
      marginTop: theme.layout.spacing.lg,
      alignItems: 'center',
    },
    founderPriceLabel: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.sm,
      opacity: 0.8,
      marginBottom: 4,
    },
    founderPriceValue: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: '900',
    },
    founderButton: {
      marginTop: theme.layout.spacing.lg,
      backgroundColor: theme.colors.white,
      borderRadius: theme.layout.radius.base,
      paddingVertical: theme.layout.spacing.base,
      alignItems: 'center',
    },
    founderButtonText: {
      color: theme.colors.gold,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '900',
    },

    // Pro Plan
    section: {
      padding: theme.layout.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.base,
    },
    planCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.lg,
      padding: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.xl,
    },
    planHeader: {
      marginBottom: theme.layout.spacing.lg,
    },
    planName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.xs,
    },
    planDescription: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    },
    planPrice: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: theme.layout.spacing.lg,
    },
    planPriceAmount: {
      fontSize: theme.typography.fontSize['5xl'],
      fontWeight: '900',
      color: theme.colors.text,
    },
    planPriceInterval: {
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.textSecondary,
      marginLeft: theme.layout.spacing.xs,
    },
    features: {
      gap: theme.layout.spacing.md,
      marginBottom: theme.layout.spacing.lg,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.layout.spacing.sm,
    },
    featureIcon: {
      fontSize: 18,
    },
    featureText: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
    },
    subscribeButton: {
      borderRadius: theme.layout.radius.base,
      overflow: 'hidden',
    },
    subscribeGradient: {
      paddingVertical: theme.layout.spacing.base,
      alignItems: 'center',
    },
    subscribeButtonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '900',
    },
    cancelButton: {
      alignItems: 'center',
      paddingVertical: theme.layout.spacing.base,
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.badge}>🎭</Text>
          <Text style={styles.title}>Devenez Artiste Pro</Text>
          <Text style={styles.subtitle}>
            Créez des concerts live et gagnez 70% des revenus
          </Text>
        </View>

        {/* Founder Offer Banner */}
        {foundersRemaining > 0 && (
          <View style={styles.founderBanner}>
            <LinearGradient
              colors={['#D4AF37', '#E50914']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.founderGradient}
            >
              <View style={styles.founderHeader}>
                <Text style={styles.founderBadgeIcon}>🏆</Text>
                <Text style={styles.founderTitle}>Offre Founder</Text>
              </View>

              <Text style={styles.founderDescription}>
                Rejoignez les artistes pionniers de Vybzzz et bénéficiez du statut premium à vie !
              </Text>

              <View style={styles.founderLimited}>
                <Text style={styles.founderLimitedText}>
                  ⚡ Plus que {foundersRemaining} places disponibles sur 50
                </Text>
              </View>

              <View style={styles.founderFeatures}>
                {PRICING.FOUNDER_BADGE.features.map((feature, index) => (
                  <View key={index} style={styles.founderFeature}>
                    <Text style={styles.founderFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.founderPrice}>
                <Text style={styles.founderPriceLabel}>Paiement unique</Text>
                <Text style={styles.founderPriceValue}>
                  {formatCurrency(PRICING.PRO_SUBSCRIPTION_MONTHLY.amount)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.founderButton}
                onPress={() => handleSubscribe(true)}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={theme.colors.gold} />
                ) : (
                  <Text style={styles.founderButtonText}>
                    Devenir Founder
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Standard Pro Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ou</Text>

          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Abonnement Pro</Text>
              <Text style={styles.planDescription}>
                {PRICING.PRO_SUBSCRIPTION_MONTHLY.description}
              </Text>
            </View>

            <View style={styles.planPrice}>
              <Text style={styles.planPriceAmount}>59€</Text>
              <Text style={styles.planPriceInterval}>/mois</Text>
            </View>

            <View style={styles.features}>
              {PRICING.PRO_SUBSCRIPTION_MONTHLY.features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleSubscribe(false)}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.gradients.goldToRed}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.subscribeGradient}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <Text style={styles.subscribeButtonText}>
                    S'abonner maintenant
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={isProcessing}
          >
            <Text style={styles.cancelButtonText}>Plus tard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
