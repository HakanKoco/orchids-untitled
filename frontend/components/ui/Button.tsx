import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SPACING, FONT_SIZE, SHADOW } from '@/lib/constants';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const containerStyle = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.label,
    styles[`labelSize_${size}`],
    styles[`labelVariant_${variant}`],
    textStyle,
  ];

  return (
    <AnimatedTouchable
      style={[animatedStyle, containerStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{title}</Text>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    ...SHADOW.sm,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  size_sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, minHeight: 40 },
  size_md: { paddingVertical: SPACING.md + 2, paddingHorizontal: SPACING.xl, minHeight: 52 },
  size_lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl, minHeight: 60 },

  variant_primary: { backgroundColor: COLORS.primary },
  variant_secondary: { backgroundColor: COLORS.primaryLight },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  variant_danger: { backgroundColor: COLORS.warning },

  label: { fontWeight: '700', letterSpacing: 0.3 },
  labelSize_sm: { fontSize: FONT_SIZE.sm },
  labelSize_md: { fontSize: FONT_SIZE.base },
  labelSize_lg: { fontSize: FONT_SIZE.md },

  labelVariant_primary: { color: COLORS.white },
  labelVariant_secondary: { color: COLORS.primary },
  labelVariant_outline: { color: COLORS.primary },
  labelVariant_ghost: { color: COLORS.primary },
  labelVariant_danger: { color: COLORS.white },
});
