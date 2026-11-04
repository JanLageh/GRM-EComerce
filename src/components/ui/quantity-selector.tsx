import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Pressable
        onPress={onDecrement}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>−</Text>
      </Pressable>
      <Text style={[styles.quantity, { color: theme.text }]}>{quantity}</Text>
      <Pressable
        onPress={onIncrement}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'center',
  },
});

