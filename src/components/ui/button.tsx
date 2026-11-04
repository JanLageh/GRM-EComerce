import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  style,
  disabled = false,
}: ButtonProps) {
  const theme = useTheme();

  const bgColors = {
    primary: theme.accent,
    secondary: theme.backgroundElement,
    danger: theme.danger,
    outline: 'transparent',
  };

  const borderColors = {
    primary: theme.accent,
    secondary: theme.backgroundElement,
    danger: theme.danger,
    outline: theme.border,
  };

  const paddings = {
    small: { paddingVertical: 6, paddingHorizontal: 12 },
    medium: { paddingVertical: 10, paddingHorizontal: 20 },
    large: { paddingVertical: 14, paddingHorizontal: 28 },
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        paddings[size],
        {
          backgroundColor: bgColors[variant],
          borderColor: borderColors[variant],
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
  },
});

