import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';

export default function AccountScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state } = useCart();
  const { state: authState, logout } = useAuth();
  const user = authState.user;

  const activeWarranties = state.orders.filter(
    (o) => new Date(o.warrantyExpiry) > new Date()
  );
  const pendingReturns = state.returns.filter((r) => r.status === 'pending');

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.text }]}>Account</Text>

        {/* User profile card */}
        {user && (
          <View style={[styles.profileCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={[styles.avatar, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>{user.name}</Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{user.email}</Text>
            </View>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                { backgroundColor: theme.dangerLight, borderColor: theme.danger, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.logoutText, { color: theme.danger }]}>Sign Out</Text>
            </Pressable>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{state.orders.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={styles.statIcon}>🛡️</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{activeWarranties.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Active Warranties</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={styles.statIcon}>↩️</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{pendingReturns.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pending Returns</Text>
          </View>
        </View>

        {/* Returns History */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Return Requests</Text>
        {state.returns.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No return requests
            </Text>
          </View>
        ) : (
          state.returns.map((ret) => {
            const statusColors = {
              pending: { bg: theme.warningLight, text: theme.warning },
              approved: { bg: theme.successLight, text: theme.success },
              denied: { bg: theme.dangerLight, text: theme.danger },
            };
            const sc = statusColors[ret.status];
            return (
              <View
                key={ret.id}
                style={[styles.returnCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              >
                <View style={styles.returnHeader}>
                  <View>
                    <Text style={[styles.returnId, { color: theme.text }]}>{ret.id}</Text>
                    <Text style={[styles.returnOrder, { color: theme.textSecondary }]}>
                      Order: {ret.orderId}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.badgeText, { color: sc.text }]}>
                      {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.returnReason, { color: theme.textSecondary }]}>
                  Reason: {ret.reason}
                </Text>
                <Text style={[styles.returnDate, { color: theme.textSecondary }]}>
                  {new Date(ret.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            );
          })
        )}

        {/* Warranty info */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Warranty Information</Text>
        {activeWarranties.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No active warranties. Purchase a product to get started.
            </Text>
          </View>
        ) : (
          activeWarranties.map((order) => (
            <View
              key={order.id}
              style={[styles.warrantyCard, { backgroundColor: theme.successLight, borderColor: theme.success }]}
            >
              <View style={styles.warrantyHeader}>
                <Text style={[styles.warrantyOrderId, { color: theme.text }]}>{order.id}</Text>
                <Text style={[styles.warrantyBadge, { color: theme.success }]}>Active</Text>
              </View>
              <Text style={[styles.warrantyExpiry, { color: theme.textSecondary }]}>
                Expires:{' '}
                {new Date(order.warrantyExpiry).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          ))
        )}
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
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F7A3F',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  emptyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  returnCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  returnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  returnId: {
    fontSize: 13,
    fontWeight: '600',
  },
  returnOrder: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  returnReason: {
    fontSize: 13,
  },
  returnDate: {
    fontSize: 12,
  },
  warrantyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 4,
  },
  warrantyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warrantyOrderId: {
    fontSize: 14,
    fontWeight: '600',
  },
  warrantyBadge: {
    fontSize: 13,
    fontWeight: '700',
  },
  warrantyExpiry: {
    fontSize: 13,
  },
});

