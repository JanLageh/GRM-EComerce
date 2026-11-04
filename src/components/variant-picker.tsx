import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ProductVariant } from '@/data/products';
import { formatPrice } from '@/data/products';
import { useTheme } from '@/hooks/use-theme';

interface VariantPickerProps {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantPicker({ variants, selectedId, onSelect }: VariantPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {variants.map((variant) => {
        const isSelected = variant.id === selectedId;
        return (
          <Pressable
            key={variant.id}
            onPress={() => onSelect(variant)}
            style={[
              styles.option,
              {
                backgroundColor: isSelected ? theme.accentLight : theme.backgroundElement,
                borderColor: isSelected ? theme.accent : theme.border,
              },
            ]}
          >
            <View style={styles.optionHeader}>
              <Text style={[styles.label, { color: isSelected ? theme.accent : theme.text }]}>
                {variant.label}
              </Text>
              <Text style={[styles.price, { color: isSelected ? theme.accent : theme.text }]}>
                {formatPrice(variant.price)}
              </Text>
            </View>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {variant.description}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  option: {
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 14,
    gap: 4,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
  },
});

