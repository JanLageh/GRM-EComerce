import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { CartItemCard } from '@/components/cart-item-card';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export default function CartScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, dispatch, cartCount, cartTotal } = useCart();

  if (state.items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Browse our solar panels and batteries to get started with clean energy."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </Text>

        {state.items.map((item) => (
          <CartItemCard
            key={item.variant.id}
            item={item}
            onUpdateQuantity={(qty) =>
              dispatch({ type: 'UPDATE_QUANTITY', variantId: item.variant.id, quantity: qty })
            }
            onRemove={() => dispatch({ type: 'REMOVE_ITEM', variantId: item.variant.id })}
          />
        ))}
      </ScrollView>

      {/* Bottom checkout bar */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.background, borderTopColor: theme.border },
        ]}
      >
        <View>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(cartTotal)}</Text>
        </View>
        <Button onPress={() => router.push('/checkout')} size="large">
          <Text style={[styles.checkoutText, { color: theme.accentText }]}>Checkout</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 13,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

