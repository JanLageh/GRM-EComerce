import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';
import { QuantitySelector } from '@/components/ui/quantity-selector';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{item.product.image}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.product.name}
          </Text>
          <Text style={[styles.variant, { color: theme.textSecondary }]}>
            {item.variant.label} — {item.variant.description}
          </Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <QuantitySelector
          quantity={item.quantity}
          onIncrement={() => onUpdateQuantity(item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(item.quantity - 1)}
        />
        <Text style={[styles.price, { color: theme.accent }]}>
          {formatPrice(item.variant.price * item.quantity)}
        </Text>
        <Pressable onPress={onRemove} hitSlop={8}>
          <Text style={[styles.remove, { color: theme.danger }]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  variant: {
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  remove: {
    fontSize: 13,
    fontWeight: '600',
  },
});

