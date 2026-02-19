import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '@/lib/constants';
import { CONSENT_TEXT } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';

export default function ConsentScreen() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const checkScale = useSharedValue(1);
  const checkBg = useSharedValue(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (isBottom) setHasScrolledToBottom(true);
  };

  const handleCheck = () => {
    const newVal = !checked;
    setChecked(newVal);
    checkScale.value = withSpring(newVal ? 1.15 : 1, { damping: 12 }, () => {
      checkScale.value = withSpring(1);
    });
    checkBg.value = withTiming(newVal ? 1 : 0, { duration: 200 });
  };

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    backgroundColor: checkBg.value === 1 ? COLORS.primary : COLORS.white,
    borderColor: checkBg.value === 1 ? COLORS.primary : COLORS.border,
  }));

  const handleContinue = () => {
    router.push('/screens/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Bilgilendirme Formu</Text>
        <Text style={styles.headerSub}>Lütfen dikkatlice okuyunuz</Text>
      </Animated.View>

      {/* Scrollable content */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.contentCard}>
        {!hasScrolledToBottom && (
          <View style={styles.scrollHint}>
            <Text style={styles.scrollHintText}>↓ Devam etmek için aşağı kaydırın</Text>
          </View>
        )}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          indicatorStyle="black">
          <Text style={styles.consentText}>{CONSENT_TEXT}</Text>
        </ScrollView>
      </Animated.View>

      {/* Footer actions */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.footer}>
        {/* Checkbox */}
        <Pressable onPress={handleCheck} style={styles.checkRow}>
          <Animated.View style={[styles.checkbox, checkStyle]}>
            {checked && <Text style={styles.checkmark}>✓</Text>}
          </Animated.View>
          <Text style={styles.checkLabel}>Okudum ve kabul ediyorum</Text>
        </Pressable>

        {/* Scroll hint for non-scrolled */}
        {!hasScrolledToBottom && (
          <Text style={styles.readFirst}>Lütfen formu okuduktan sonra onaylayın</Text>
        )}

        {/* Continue button */}
        <Button
          title="Devam Et"
          onPress={handleContinue}
          disabled={!checked}
          size="lg"
          style={{ marginTop: SPACING.sm }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.xs,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  backText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    overflow: 'hidden',
    position: 'relative',
  },
  scrollHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(245,250,248,0.95)',
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  scrollHintText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl + SPACING.xl,
  },
  consentText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 26,
    letterSpacing: 0.1,
  },
  footer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  checkLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  readFirst: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
