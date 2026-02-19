import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOW, SPACING } from '@/lib/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat';
  padding?: number;
}

export function Card({ children, style, variant = 'elevated', padding = SPACING.xl }: CardProps) {
  return (
    <View style={[styles.base, styles[`variant_${variant}`], { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  variant_default: {
    ...SHADOW.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  variant_elevated: {
    ...SHADOW.md,
  },
  variant_flat: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
