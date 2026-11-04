import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { OrderCard } from '@/components/order-card';
import { EmptyState } from '@/components/empty-state';
import { useTheme } from '@/hooks/use-theme';

export default function OrdersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state } = useCart();

  if (state.orders.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <EmptyState
          icon="📦"
          title="No orders yet"
          message="Your order history will appear here after you make a purchase."
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
        <Text style={[styles.title, { color: theme.text }]}>Your Orders</Text>
        {state.orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
});

