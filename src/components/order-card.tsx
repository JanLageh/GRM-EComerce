import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Order } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

export function OrderCard({ order, showActions = true }: OrderCardProps) {
  const theme = useTheme();
  const orderDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const warrantyDate = new Date(order.warrantyExpiry).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const isWarrantyActive = new Date(order.warrantyExpiry) > new Date();

  const statusColors = {
    processing: { bg: theme.warningLight, text: theme.warning },
    shipped: { bg: theme.accentLight, text: theme.accent },
    delivered: { bg: theme.successLight, text: theme.success },
  };
  const statusStyle = statusColors[order.status];

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.orderId, { color: theme.text }]}>{order.id}</Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{orderDate}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.badgeText, { color: statusStyle.text }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.items}>
        {order.items.map((item, i) => (
          <Text key={i} style={[styles.itemText, { color: theme.textSecondary }]}>
            {item.quantity}× {item.product.name} ({item.variant.label})
          </Text>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.footer}>
        <View>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(order.total)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.warrantyLabel, { color: theme.textSecondary }]}>
            Warranty {isWarrantyActive ? 'until' : 'expired'}
          </Text>
          <Text
            style={[
              styles.warrantyDate,
              { color: isWarrantyActive ? theme.success : theme.danger },
            ]}
          >
            {warrantyDate}
          </Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push({ pathname: '/return/[orderId]', params: { orderId: order.id } })}
            style={[styles.actionButton, { borderColor: theme.border }]}
          >
            <Text style={[styles.actionText, { color: theme.text }]}>Request Return</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push({ pathname: '/warranty/[orderId]', params: { orderId: order.id } })}
            style={[styles.actionButton, { borderColor: theme.accent, backgroundColor: theme.accentLight }]}
          >
            <Text style={[styles.actionText, { color: theme.accent }]}>Renew Warranty</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  items: {
    gap: 2,
  },
  itemText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  warrantyLabel: {
    fontSize: 12,
  },
  warrantyDate: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

