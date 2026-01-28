/**
 * TicketCheckoutScreen
 * Stripe checkout for concert ticket purchase with PaymentSheet
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStripe } from '@stripe/stripe-react-native';
import { useAppTheme } from '@/hooks/useTheme';
import { fetchPaymentSheetParams, formatCurrency } from '@/services/stripe';

interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  price: number;
  genre: string;
}

interface TicketCheckoutScreenProps {
  concert: Concert;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TicketCheckoutScreen: React.FC<TicketCheckoutScreenProps> = ({
  concert,
  onSuccess,
  onCancel,
}) => {
  const theme = useAppTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize PaymentSheet on mount
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams(
          concert.id,
          concert.price * 100, // Convert to cents
          'eur'
        );

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Vybzzz',
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey || undefined,
        customerId: customer || undefined,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: '',
        },
        style: 'automatic',
      });

      if (!error) {
        setIsReady(true);
      } else {
        console.warn('PaymentSheet init error:', error);
      }
    } catch (error) {
      console.warn('Failed to initialize payment sheet:', error);
    }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);

    try {
      // If PaymentSheet is ready, use it
      if (isReady) {
        const { error } = await presentPaymentSheet();

        if (error) {
          if (error.code === 'Canceled') {
            // User cancelled - do nothing
            setIsProcessing(false);
            return;
          }
          Alert.alert('Erreur de paiement', error.message);
          setIsProcessing(false);
          return;
        }

        // Payment succeeded
        Alert.alert(
          'Paiement réussi !',
          `Votre billet pour "${concert.title}" a été acheté.\n\nVous recevrez un email de confirmation avec votre QR code.`,
          [
            {
              text: 'Voir mes billets',
              onPress: () => onSuccess?.(),
            },
          ]
        );
      } else {
        // PaymentSheet not ready - try to re-initialize
        Alert.alert(
          'Paiement indisponible',
          'Le système de paiement n\'est pas prêt. Vérifiez que le backend API est configuré (EXPO_PUBLIC_RORK_API_BASE_URL dans .env) et que les produits Stripe sont créés.',
          [{ text: 'Réessayer', onPress: initializePaymentSheet }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erreur de paiement',
        error.message || 'Une erreur est survenue lors du paiement. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
      console.error('Payment error:', error);
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
      paddingBottom: theme.layout.spacing['5xl'],
    },
    header: {
      padding: theme.layout.spacing.xl,
      paddingTop: theme.layout.spacing['5xl'],
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: '900',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    section: {
      padding: theme.layout.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.base,
    },
    concertCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.lg,
      padding: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.xl,
    },
    concertTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.layout.spacing.xs,
    },
    concertArtist: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      marginBottom: theme.layout.spacing.sm,
    },
    concertDetails: {
      flexDirection: 'row',
      gap: theme.layout.spacing.lg,
      marginTop: theme.layout.spacing.md,
    },
    detail: {
      flex: 1,
    },
    detailLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: '600',
      color: theme.colors.text,
    },
    priceBreakdown: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.layout.radius.lg,
      padding: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.xl,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.layout.spacing.md,
    },
    priceLabel: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    priceValue: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: '600',
      color: theme.colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.layout.spacing.md,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.layout.spacing.sm,
    },
    totalLabel: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '700',
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: '900',
      color: theme.colors.gold,
    },
    actions: {
      padding: theme.layout.spacing.xl,
      gap: theme.layout.spacing.md,
    },
    buttonContainer: {
      borderRadius: theme.layout.radius.lg,
      overflow: 'hidden',
    },
    button: {
      paddingVertical: theme.layout.spacing.lg,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '900',
    },
    cancelButton: {
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.layout.radius.lg,
      paddingVertical: theme.layout.spacing.base,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.base,
      fontWeight: '600',
    },
    secureInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.layout.spacing.base,
      gap: theme.layout.spacing.xs,
    },
    secureText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Finaliser l'achat</Text>
          <Text style={styles.subtitle}>
            Paiement sécurisé par Stripe
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du concert</Text>
          <View style={styles.concertCard}>
            <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: theme.colors.gold, borderRadius: 4, marginBottom: 8 }}>
              <Text style={{ color: theme.colors.black, fontWeight: '700', fontSize: 10 }}>
                {concert.genre.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.concertTitle}>{concert.title}</Text>
            <Text style={styles.concertArtist}>{concert.artist}</Text>
            <View style={styles.concertDetails}>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{concert.date}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Heure</Text>
                <Text style={styles.detailValue}>{concert.time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Prix du billet</Text>
              <Text style={styles.priceValue}>{formatCurrency(concert.price * 100)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Frais de service</Text>
              <Text style={styles.priceValue}>Inclus</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(concert.price * 100)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handlePurchase}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.gradients.goldToRed}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                Payer {formatCurrency(concert.price * 100)}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secureInfo}>
          <Text style={styles.secureText}>🔒</Text>
          <Text style={styles.secureText}>
            Paiement sécurisé avec chiffrement SSL
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isProcessing}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
