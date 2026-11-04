import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export default function CheckoutScreen() {
  const theme = useTheme();
  const { state, dispatch, cartTotal } = useCart();

  if (state.items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Your cart is empty
          </Text>
        </View>
      </View>
    );
  }

  const handlePlaceOrder = () => {
    Alert.alert(
      'Confirm Order',
      `Place order for ${formatPrice(cartTotal)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: () => {
            dispatch({ type: 'PLACE_ORDER' });
            Alert.alert('Order Placed! 🎉', 'Your order has been placed successfully. Check the Orders tab for updates.', [
              { text: 'View Orders', onPress: () => { router.dismiss(); router.push('/orders'); } },
            ]);
          },
        },
      ]
    );
  };

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 500 ? 0 : 49.99;
  const grandTotal = cartTotal + tax + shipping;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Order Summary</Text>

        {/* Items */}
        {state.items.map((item) => (
          <View key={item.variant.id} style={[styles.itemRow, { borderBottomColor: theme.border }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.product.name}</Text>
              <Text style={[styles.itemVariant, { color: theme.textSecondary }]}>
                {item.variant.label} × {item.quantity}
              </Text>
            </View>
            <Text style={[styles.itemPrice, { color: theme.text }]}>
              {formatPrice(item.variant.price * item.quantity)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(cartTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Tax (8%)</Text>
            <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Shipping</Text>
            <Text style={[styles.totalValue, { color: shipping === 0 ? theme.success : theme.text }]}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </Text>
          </View>
          {shipping === 0 && (
            <Text style={[styles.freeShipping, { color: theme.success }]}>
              ✓ Free shipping on orders over $500
            </Text>
          )}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.grandTotalLabel, { color: theme.text }]}>Total</Text>
            <Text style={[styles.grandTotalValue, { color: theme.accent }]}>
              {formatPrice(grandTotal)}
            </Text>
          </View>
        </View>

        {/* Warranty info */}
        <View style={[styles.infoCard, { backgroundColor: theme.successLight, borderColor: theme.success }]}>
          <Text style={[styles.infoTitle, { color: theme.success }]}>🛡️ Warranty Included</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            All products come with manufacturer warranty. You can renew or extend your warranty anytime from the Orders tab.
          </Text>
        </View>

        {/* Place order */}
        <Button onPress={handlePlaceOrder} size="large" style={styles.placeOrderButton}>
          <Text style={[styles.placeOrderText, { color: theme.accentText }]}>
            Place Order — {formatPrice(grandTotal)}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemVariant: {
    fontSize: 13,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
  },
  totals: {
    marginTop: 20,
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 15,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  freeShipping: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 24,
    gap: 6,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  placeOrderButton: {
    marginTop: 24,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
