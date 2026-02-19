import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, FONT_SIZE } from '@/lib/constants';

type BadgeVariant = 'primary' | 'teal' | 'warning' | 'muted' | 'success';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Badge({ label, variant = 'primary', style, icon }: BadgeProps) {
  return (
    <View style={[styles.container, styles[`variant_${variant}`], style]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  iconWrap: { marginRight: SPACING.xs },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', letterSpacing: 0.2 },

  variant_primary: { backgroundColor: COLORS.primaryLight },
  variant_teal: { backgroundColor: COLORS.tealLight },
  variant_warning: { backgroundColor: COLORS.warningLight },
  variant_muted: { backgroundColor: '#F0F4F3' },
  variant_success: { backgroundColor: COLORS.successLight },

  label_primary: { color: COLORS.primary },
  label_teal: { color: COLORS.teal },
  label_warning: { color: COLORS.warning },
  label_muted: { color: COLORS.textMuted },
  label_success: { color: COLORS.success },
});
