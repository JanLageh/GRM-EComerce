import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const theme = useTheme();
  const { state, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleLogin = () => {
    if (!email.trim() || !password) return;
    login(email, password);
  };

  const isDisabled = !email.trim() || !password || state.isLoading;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / branding */}
          <View style={styles.hero}>
            <View style={[styles.logoCircle, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.logoEmoji}>☀️</Text>
            </View>
            <Text style={[styles.appName, { color: theme.text }]}>SolarShop</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Clean energy for every home
            </Text>
          </View>

          {/* Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>Welcome back</Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Sign in to your account
            </Text>

            {/* Error banner */}
            {state.error && (
              <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  ⚠️  {state.error}
                </Text>
              </View>
            )}

            {/* Email field */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.background,
                    borderColor:
                      focusedField === 'email' ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!state.isLoading}
                />
              </View>
            </View>

            {/* Password field */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.background,
                    borderColor:
                      focusedField === 'password' ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!state.isLoading}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Remember me + Forgot */}
            <View style={styles.row}>
              <Pressable
                onPress={() => setRememberMe((v) => !v)}
                style={styles.rememberRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: rememberMe ? theme.accent : 'transparent',
                      borderColor: rememberMe ? theme.accent : theme.border,
                    },
                  ]}
                >
                  {rememberMe && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={[styles.rememberText, { color: theme.textSecondary }]}>
                  Remember me
                </Text>
              </Pressable>
              <Pressable hitSlop={8}>
                <Text style={[styles.forgotText, { color: theme.accent }]}>
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Sign in button */}
            <Pressable
              onPress={handleLogin}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.signInButton,
                {
                  backgroundColor: theme.accent,
                  opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
                },
              ]}
            >
              {state.isLoading ? (
                <ActivityIndicator color={theme.accentText} />
              ) : (
                <Text style={[styles.signInText, { color: theme.accentText }]}>
                  Sign In
                </Text>
              )}
            </Pressable>
          </View>

          {/* Demo credentials hint */}
          <View
            style={[
              styles.demoCard,
              { backgroundColor: theme.accentLight, borderColor: theme.accent },
            ]}
          >
            <Text style={[styles.demoTitle, { color: theme.accent }]}>
              💡 Demo credentials
            </Text>
            <Pressable onPress={() => { setEmail('demo@solarshop.com'); setPassword('demo1234'); }}>
              <Text style={[styles.demoRow, { color: theme.textSecondary }]}>
                Email:{' '}
                <Text style={{ color: theme.text, fontWeight: '600' }}>
                  demo@solarshop.com
                </Text>
              </Text>
              <Text style={[styles.demoRow, { color: theme.textSecondary }]}>
                Password:{' '}
                <Text style={{ color: theme.text, fontWeight: '600' }}>demo1234</Text>
              </Text>
              <Text style={[styles.demoHint, { color: theme.accent }]}>
                Tap to autofill →
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Don&apos;t have an account?{' '}
            </Text>
            <Pressable hitSlop={8}>
              <Text style={[styles.footerLink, { color: theme.accent }]}>
                Create one
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 40,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: -6,
    marginBottom: 2,
  },
  errorBanner: {
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  inputIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  rememberText: {
    fontSize: 13,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  signInButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '700',
  },
  demoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  demoRow: {
    fontSize: 13,
    lineHeight: 20,
  },
  demoHint: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

