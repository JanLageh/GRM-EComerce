import { useEffect } from 'react';
import { Stack, DarkTheme, DefaultTheme, ThemeProvider, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

/** Redirects to /login when logged out, to / when logged in. */
function AuthGate() {
  const { state } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login';
    if (!state.user && !inAuthGroup) {
      router.replace('/login');
    } else if (state.user && inAuthGroup) {
      router.replace('/');
    }
  }, [state.user, segments]);

  return null;
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: true, title: 'Product Details', presentation: 'card' }}
        />
        <Stack.Screen
          name="checkout"
          options={{ headerShown: true, title: 'Checkout', presentation: 'modal' }}
        />
        <Stack.Screen
          name="return/[orderId]"
          options={{ headerShown: true, title: 'Request Return', presentation: 'modal' }}
        />
        <Stack.Screen
          name="warranty/[orderId]"
          options={{ headerShown: true, title: 'Renew Warranty', presentation: 'modal' }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutInner />
      </CartProvider>
    </AuthProvider>
  );
}
