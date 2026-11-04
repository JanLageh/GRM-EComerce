import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Product } from '@/data/products';
import { formatPrice } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{product.image}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.category, { color: theme.textSecondary }]}>
          {product.category === 'solar-panel' ? 'Solar Panel' : 'Battery'}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.accent }]}>
            From {formatPrice(minPrice)}
          </Text>
          <Text style={[styles.variants, { color: theme.textSecondary }]}>
            {product.variants.length} sizes
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  info: {
    padding: 14,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  variants: {
    fontSize: 12,
  },
});

