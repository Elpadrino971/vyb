/**
 * BecomeProScreen
 * Subscription selection: Smart (39€), Pro (79€), Premium (99€)
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
import { useStripe } from '@stripe/stripe-react-native';
import { useAppTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import {
  PRICING,
  fetchSubscriptionParams,
  formatCurrency,
  SubscriptionPlan,
} from '@/services/stripe';

interface BecomeProScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  navigation?: any;
}

export const BecomeProScreen: React.FC<BecomeProScreenProps> = ({
  onSuccess,
  onCancel,
  navigation,
}) => {
  const theme = useAppTheme();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const plans = [
    {
      key: 'smart' as SubscriptionPlan,
      ...PRICING.SUBSCRIPTIONS.SMART,
      color: '#4CAF50',
      popular: false,
    },
    {
      key: 'pro' as SubscriptionPlan,
      ...PRICING.SUBSCRIPTIONS.PRO,
      color: '#2196F3',
      popular: true,
    },
    {
      key: 'premium' as SubscriptionPlan,
      ...PRICING.SUBSCRIPTIONS.PREMIUM,
      color: '#D4AF37',
      popular: false,
    },
  ];

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setIsProcessing(true);
    setSelectedPlan(plan);

    try {
      const userId = user?.id || '';

      if (!userId) {
        Alert.alert('Erreur', 'Vous devez être connecté pour souscrire.');
        setIsProcessing(false);
        setSelectedPlan(null);
        return;
      }

      // Fetch payment sheet params from Supabase Edge Function
      const { paymentIntent, ephemeralKey, customer } =
        await fetchSubscriptionParams(userId, plan);

      // Initialize PaymentSheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Vybzzz',
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey || undefined,
        customerId: customer || undefined,
        allowsDelayedPaymentMethods: false,
        style: 'automatic',
      });

      if (initError) {
        Alert.alert('Erreur', initError.message);
        setIsProcessing(false);
        setSelectedPlan(null);
        return;
      }

      // Present PaymentSheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert('Erreur de paiement', presentError.message);
        }
        setIsProcessing(false);
        setSelectedPlan(null);
        return;
      }

      // Payment succeeded
      const planDetails = PRICING.SUBSCRIPTIONS[plan.toUpperCase() as keyof typeof PRICING.SUBSCRIPTIONS];
      Alert.alert(
        `Bienvenue chez les ${planDetails.name} !`,
        `Votre abonnement ${planDetails.name} est activé.\n\nVous bénéficiez du modèle ${planDetails.revenueSplit}/${100 - planDetails.revenueSplit}.\n\nCommencez à créer vos concerts !`,
        [
          {
            text: 'Créer mon premier concert',
            onPress: () => {
              onSuccess?.();
              navigation?.goBack?.();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Une erreur est survenue.',
        [{ text: 'OK' }]
      );
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
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
      paddingTop: theme.layout.spacing['4xl'],
      alignItems: 'center',
    },
    badge: {
      fontSize: 50,
      marginBottom: theme.layout.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: '900',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: theme.layout.spacing.xl,
    },

    plansContainer: {
      padding: theme.layout.spacing.lg,
      gap: theme.layout.spacing.lg,
    },

    planCard: {
      borderRadius: theme.layout.radius.lg,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    planCardPopular: {
      borderColor: '#2196F3',
      borderWidth: 3,
    },
    popularBadge: {
      backgroundColor: '#2196F3',
      paddingVertical: theme.layout.spacing.xs,
      alignItems: 'center',
    },
    popularBadgeText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '700',
    },
    planContent: {
      padding: theme.layout.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.layout.spacing.md,
    },
    planName: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '900',
      color: theme.colors.text,
    },
    planSplit: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '700',
      paddingHorizontal: theme.layout.spacing.sm,
      paddingVertical: theme.layout.spacing.xs,
      borderRadius: theme.layout.radius.sm,
      overflow: 'hidden',
    },
    planDescription: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.layout.spacing.md,
    },
    planPrice: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: theme.layout.spacing.lg,
    },
    planPriceAmount: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: '900',
      color: theme.colors.text,
    },
    planPriceInterval: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      marginLeft: theme.layout.spacing.xs,
    },
    features: {
      gap: theme.layout.spacing.sm,
      marginBottom: theme.layout.spacing.lg,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.layout.spacing.sm,
    },
    featureIcon: {
      fontSize: 16,
    },
    featureText: {
      flex: 1,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
    },
    subscribeButton: {
      borderRadius: theme.layout.radius.base,
      overflow: 'hidden',
    },
    subscribeGradient: {
      paddingVertical: theme.layout.spacing.md,
      alignItems: 'center',
    },
    subscribeButtonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.base,
      fontWeight: '900',
    },

    cancelButton: {
      alignItems: 'center',
      paddingVertical: theme.layout.spacing.xl,
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.base,
    },

    compareSection: {
      padding: theme.layout.spacing.xl,
      paddingTop: 0,
    },
    compareTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.layout.spacing.md,
    },
    compareText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.badge}>🎭</Text>
          <Text style={styles.title}>Devenez Artiste</Text>
          <Text style={styles.subtitle}>
            Choisissez le plan qui correspond à vos ambitions
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View
              key={plan.key}
              style={[
                styles.planCard,
                plan.popular && styles.planCardPopular,
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>LE PLUS POPULAIRE</Text>
                </View>
              )}

              <View style={styles.planContent}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text
                    style={[
                      styles.planSplit,
                      { backgroundColor: plan.color, color: '#FFF' },
                    ]}
                  >
                    {plan.revenueSplit}/{100 - plan.revenueSplit}
                  </Text>
                </View>

                <Text style={styles.planDescription}>{plan.description}</Text>

                <View style={styles.planPrice}>
                  <Text style={styles.planPriceAmount}>
                    {formatCurrency(plan.amount)}
                  </Text>
                  <Text style={styles.planPriceInterval}>/mois</Text>
                </View>

                <View style={styles.features}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.feature}>
                      <Text style={[styles.featureIcon, { color: plan.color }]}>
                        ✓
                      </Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={() => handleSubscribe(plan.key)}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      plan.key === 'premium'
                        ? ['#D4AF37', '#E50914']
                        : plan.key === 'pro'
                        ? ['#2196F3', '#1976D2']
                        : ['#4CAF50', '#388E3C']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.subscribeGradient}
                  >
                    {isProcessing && selectedPlan === plan.key ? (
                      <ActivityIndicator size="small" color={theme.colors.white} />
                    ) : (
                      <Text style={styles.subscribeButtonText}>
                        Choisir {plan.name}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.compareSection}>
          <Text style={styles.compareTitle}>Comment ça marche ?</Text>
          <Text style={styles.compareText}>
            Le split indique la répartition des revenus.{'\n'}
            Smart: vous gardez 50% | Pro: 60% | Premium: 70%{'\n'}
            Plus votre plan est élevé, plus vous gagnez !
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel || (() => navigation?.goBack?.())}
          disabled={isProcessing}
        >
          <Text style={styles.cancelButtonText}>Plus tard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
