import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getProduct, formatPrice } from '@/data/products';
import type { ProductVariant } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { VariantPicker } from '@/components/variant-picker';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export default function ProductDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dispatch } = useCart();
  const product = getProduct(id);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.danger }]}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      Alert.alert('Select a size', 'Please choose a size option before adding to cart.');
      return;
    }
    dispatch({ type: 'ADD_ITEM', product, variant: selectedVariant });
    Alert.alert('Added to Cart', `${product.name} (${selectedVariant.label}) has been added to your cart.`, [
      { text: 'Continue Shopping', onPress: () => router.back() },
      { text: 'View Cart', onPress: () => { router.back(); router.push('/cart'); } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Product hero */}
        <View style={[styles.hero, { backgroundColor: theme.backgroundElement }]}>
          <Text style={styles.emoji}>{product.image}</Text>
        </View>

        {/* Product info */}
        <View style={styles.content}>
          <Text style={[styles.category, { color: theme.textSecondary }]}>
            {product.category === 'solar-panel' ? 'Solar Panel' : 'Battery'}
          </Text>
          <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {product.description}
          </Text>

          {/* Warranty badge */}
          <View style={[styles.warrantyBadge, { backgroundColor: theme.successLight }]}>
            <Text style={[styles.warrantyText, { color: theme.success }]}>
              🛡️ {product.warrantyYears}-year warranty included
            </Text>
          </View>

          {/* Variant picker */}
          <SectionHeader
            title={product.category === 'solar-panel' ? 'Select Panel Size' : 'Select Capacity'}
            subtitle="Choose the option that fits your needs"
          />
          <VariantPicker
            variants={product.variants}
            selectedId={selectedVariant?.id ?? null}
            onSelect={setSelectedVariant}
          />
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <View>
          {selectedVariant ? (
            <>
              <Text style={[styles.selectedLabel, { color: theme.textSecondary }]}>
                {selectedVariant.label}
              </Text>
              <Text style={[styles.selectedPrice, { color: theme.text }]}>
                {formatPrice(selectedVariant.price)}
              </Text>
            </>
          ) : (
            <Text style={[styles.selectPrompt, { color: theme.textSecondary }]}>
              Select a size above
            </Text>
          )}
        </View>
        <Button onPress={handleAddToCart} size="large" disabled={!selectedVariant}>
          <Text style={[styles.addToCartText, { color: theme.accentText }]}>Add to Cart</Text>
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
    paddingBottom: 120,
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  hero: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 80,
  },
  content: {
    padding: 20,
    gap: 8,
  },
  category: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  warrantyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  warrantyText: {
    fontSize: 14,
    fontWeight: '600',
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
  selectedLabel: {
    fontSize: 13,
  },
  selectedPrice: {
    fontSize: 22,
    fontWeight: '700',
  },
  selectPrompt: {
    fontSize: 14,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
