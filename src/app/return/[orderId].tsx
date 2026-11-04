import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const RETURN_REASONS = [
  'Product is defective or damaged',
  'Wrong product received',
  'Product does not match description',
  'No longer needed',
  'Found a better price elsewhere',
  'Other',
];

export default function ReturnScreen() {
  const theme = useTheme();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { state, dispatch } = useCart();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState('');

  const order = state.orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.danger }]}>Order not found</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    const reason =
      selectedReason === 'Other' ? otherReason || 'Other' : selectedReason;
    if (!reason) {
      Alert.alert('Select a reason', 'Please select a reason for your return.');
      return;
    }

    dispatch({ type: 'REQUEST_RETURN', orderId: order.id, reason });
    Alert.alert(
      'Return Requested',
      'Your return request has been submitted. We will review it within 2-3 business days.',
      [{ text: 'OK', onPress: () => router.dismiss() }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Return Request</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Order: {order.id}
        </Text>

        {/* Order items summary */}
        <View style={[styles.orderSummary, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          {order.items.map((item, i) => (
            <Text key={i} style={[styles.orderItem, { color: theme.text }]}>
              {item.quantity}× {item.product.name} ({item.variant.label})
            </Text>
          ))}
        </View>

        {/* Reason selection */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Reason for Return</Text>
        <View style={styles.reasons}>
          {RETURN_REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <Pressable
                key={reason}
                onPress={() => setSelectedReason(reason)}
                style={[
                  styles.reasonOption,
                  {
                    backgroundColor: isSelected ? theme.accentLight : theme.backgroundElement,
                    borderColor: isSelected ? theme.accent : theme.border,
                  },
                ]}
              >
                <View style={[styles.radio, { borderColor: isSelected ? theme.accent : theme.textSecondary }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />}
                </View>
                <Text style={[styles.reasonText, { color: theme.text }]}>{reason}</Text>
              </Pressable>
            );
          })}
        </View>

        {selectedReason === 'Other' && (
          <TextInput
            style={[
              styles.textInput,
              {
                color: theme.text,
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
            placeholder="Please describe your reason..."
            placeholderTextColor={theme.textSecondary}
            value={otherReason}
            onChangeText={setOtherReason}
            multiline
            numberOfLines={3}
          />
        )}

        {/* Policy notice */}
        <View style={[styles.notice, { backgroundColor: theme.warningLight, borderColor: theme.warning }]}>
          <Text style={[styles.noticeTitle, { color: theme.warning }]}>⚠️ Return Policy</Text>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            Returns must be requested within 30 days of delivery. Products must be in original packaging and undamaged condition.
          </Text>
        </View>

        <Button onPress={handleSubmit} size="large" disabled={!selectedReason}>
          <Text style={[styles.submitText, { color: theme.accentText }]}>Submit Return Request</Text>
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
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  orderSummary: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
    gap: 4,
  },
  orderItem: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  reasons: {
    gap: 8,
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  reasonText: {
    fontSize: 14,
    flex: 1,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  notice: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
    gap: 6,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 18,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

