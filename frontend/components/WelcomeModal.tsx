import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Button } from '@/components/ui/Button';
import { COLORS, RADIUS, SPACING, FONT_SIZE, SHADOW } from '@/lib/constants';

const { width } = Dimensions.get('window');

interface WelcomeModalProps {
  visible: boolean;
  onStart: () => void;
}

export function WelcomeModal({ visible, onStart }: WelcomeModalProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const translateY = useSharedValue(30);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
      scale.value = withSpring(1, { damping: 18, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 250 });
      scale.value = withTiming(0.85, { duration: 250 });
      translateY.value = withTiming(30, { duration: 250 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Top accent strip */}
          <View style={styles.accentStrip} />

          <View style={styles.cardContent}>
            {/* Logo / Icon */}
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🫁</Text>
            </View>

            {/* Greeting */}
            <Text style={styles.greeting}>Merhaba</Text>

            {/* Tagline */}
            <Text style={styles.tagline}>KOAH Rehabilitasyon</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>Hazır mıyız?</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description */}
            <Text style={styles.description}>
              Rehberli nefes egzersizleri ve solunum rutinleriyle kendinizi daha iyi
              hissedebilirsiniz.
            </Text>

            {/* CTA Button */}
            <Button title="Başla" onPress={onStart} size="lg" style={styles.button} />

            {/* Footer note */}
            <Text style={styles.footerNote}>Doktorunuzun onayı ile kullanınız</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: width - SPACING.xl * 2,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl + 4,
    overflow: 'hidden',
    ...SHADOW.lg,
  },
  accentStrip: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  cardContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 3,
    borderColor: COLORS.primaryMid,
  },
  iconEmoji: {
    fontSize: 42,
  },
  greeting: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: -SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  divider: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.primaryMid,
    borderRadius: RADIUS.full,
    marginVertical: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: SPACING.md,
  },
  button: {
    marginTop: SPACING.sm,
    ...SHADOW.md,
  },
  footerNote: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
