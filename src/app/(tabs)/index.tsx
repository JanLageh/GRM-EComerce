import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { products, type ProductCategory } from '@/data/products';
import { ProductCard } from '@/components/product-card';
import { SectionHeader } from '@/components/section-header';
import { useTheme } from '@/hooks/use-theme';

type Filter = 'all' | ProductCategory;

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All Products' },
  { key: 'solar-panel', label: 'Solar Panels' },
  { key: 'battery', label: 'Batteries' },
];

export default function ShopScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filtered =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.accent }]}>☀️ SolarShop</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Clean energy for every home
          </Text>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => {
            const isActive = f.key === activeFilter;
            return (
              <Pressable
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? theme.accent : theme.backgroundElement,
                    borderColor: isActive ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isActive ? theme.accentText : theme.text },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Products */}
        <SectionHeader
          title={
            activeFilter === 'all'
              ? 'All Products'
              : activeFilter === 'solar-panel'
                ? 'Solar Panels'
                : 'Batteries'
          }
          subtitle={`${filtered.length} products available`}
        />
        <View style={styles.grid}>
          {filtered.map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
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
  header: {
    marginBottom: 20,
    gap: 4,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 15,
  },
  filterRow: {
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 160,
  },
});

