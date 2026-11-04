import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const RENEWAL_COST = 149.99;

export default function WarrantyScreen() {
  const theme = useTheme();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { state, dispatch } = useCart();

  const order = state.orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.danger }]}>Order not found</Text>
      </View>
    );
  }

  const warrantyDate = new Date(order.warrantyExpiry);
  const isActive = warrantyDate > new Date();
  const newExpiry = new Date(warrantyDate);
  newExpiry.setFullYear(newExpiry.getFullYear() + 2);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleRenew = () => {
    Alert.alert(
      'Confirm Renewal',
      `Extend warranty by 2 years for ${formatPrice(RENEWAL_COST)}?\n\nNew expiry: ${formatDate(newExpiry)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Renew',
          onPress: () => {
            dispatch({ type: 'RENEW_WARRANTY', orderId: order.id });
            Alert.alert(
              'Warranty Renewed! 🛡️',
              `Your warranty has been extended until ${formatDate(newExpiry)}.`,
              [{ text: 'OK', onPress: () => router.dismiss() }]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Warranty Renewal</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Order: {order.id}
        </Text>

        {/* Current warranty status */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: isActive ? theme.successLight : theme.dangerLight,
              borderColor: isActive ? theme.success : theme.danger,
            },
          ]}
        >
          <Text style={[styles.statusTitle, { color: isActive ? theme.success : theme.danger }]}>
            {isActive ? '🛡️ Warranty Active' : '⚠️ Warranty Expired'}
          </Text>
          <Text style={[styles.statusDate, { color: theme.textSecondary }]}>
            {isActive ? 'Expires' : 'Expired'}: {formatDate(warrantyDate)}
          </Text>
        </View>

        {/* Products covered */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Products Covered</Text>
        <View style={[styles.productsCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          {order.items.map((item, i) => (
            <View key={i} style={styles.productRow}>
              <Text style={styles.productEmoji}>{item.product.image}</Text>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.text }]}>{item.product.name}</Text>
                <Text style={[styles.productVariant, { color: theme.textSecondary }]}>
                  {item.variant.label} — Original warranty: {item.product.warrantyYears} years
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Renewal details */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Renewal Plan</Text>
        <View style={[styles.renewalCard, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}>
          <View style={styles.renewalRow}>
            <Text style={[styles.renewalLabel, { color: theme.textSecondary }]}>Extension Period</Text>
            <Text style={[styles.renewalValue, { color: theme.text }]}>+2 Years</Text>
          </View>
          <View style={styles.renewalRow}>
            <Text style={[styles.renewalLabel, { color: theme.textSecondary }]}>New Expiry Date</Text>
            <Text style={[styles.renewalValue, { color: theme.text }]}>{formatDate(newExpiry)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.renewalRow}>
            <Text style={[styles.renewalPriceLabel, { color: theme.text }]}>Renewal Cost</Text>
            <Text style={[styles.renewalPrice, { color: theme.accent }]}>
              {formatPrice(RENEWAL_COST)}
            </Text>
          </View>
        </View>

        {/* What's covered */}
        <View style={[styles.coverageCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Text style={[styles.coverageTitle, { color: theme.text }]}>What&apos;s Covered</Text>
          {[
            'Manufacturing defects',
            'Performance degradation beyond normal specs',
            'Electrical component failure',
            'Free replacement or repair',
            'Priority customer support',
          ].map((item, i) => (
            <Text key={i} style={[styles.coverageItem, { color: theme.textSecondary }]}>
              ✓ {item}
            </Text>
          ))}
        </View>

        <Button onPress={handleRenew} size="large" style={styles.renewButton}>
          <Text style={[styles.renewButtonText, { color: theme.accentText }]}>
            Renew Warranty — {formatPrice(RENEWAL_COST)}
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  statusCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    gap: 4,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  statusDate: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  productsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
    gap: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productEmoji: {
    fontSize: 28,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
  },
  productVariant: {
    fontSize: 12,
  },
  renewalCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  renewalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  renewalLabel: {
    fontSize: 14,
  },
  renewalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  renewalPriceLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  renewalPrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  coverageCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    gap: 6,
  },
  coverageTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  coverageItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  renewButton: {
    marginTop: 4,
  },
  renewButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

