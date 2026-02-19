import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  FadeInDown,
  FadeIn,
  Easing,
  cancelAnimation,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '@/lib/constants';
import { EXERCISES } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { saveExerciseComplete } from '@/lib/storage';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 160;

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle';

const PHASE_CONFIG: Record<Phase, { label: string; color: string; duration: number }> = {
  inhale: { label: 'Nefes Al', color: COLORS.primary, duration: 4000 },
  hold: { label: 'Tut', color: COLORS.teal, duration: 2000 },
  exhale: { label: 'Nefes Ver', color: '#2563EB', duration: 6000 },
  idle: { label: 'Hazır', color: COLORS.textMuted, duration: 0 },
};

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = EXERCISES.find((e) => e.id === id);

  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const circleScale = useSharedValue(1);
  const circleOpacity = useSharedValue(0.6);
  const pulseScale = useSharedValue(1);

  const stopBreathing = useCallback(() => {
    setIsRunning(false);
    setPhase('idle');
    cancelAnimation(circleScale);
    cancelAnimation(circleOpacity);
    cancelAnimation(pulseScale);
    circleScale.value = withSpring(1);
    circleOpacity.value = withTiming(0.6);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      stopBreathing();
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let countdownId: ReturnType<typeof setInterval>;

    const runCycle = () => {
      // Inhale
      setPhase('inhale');
      setCountdown(4);
      circleScale.value = withTiming(1.45, { duration: 4000, easing: Easing.inOut(Easing.ease) });
      circleOpacity.value = withTiming(1, { duration: 4000 });

      countdownId = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);

      timeoutId = setTimeout(() => {
        clearInterval(countdownId);
        // Hold
        setPhase('hold');
        setCountdown(2);
        countdownId = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);

        timeoutId = setTimeout(() => {
          clearInterval(countdownId);
          // Exhale
          setPhase('exhale');
          setCountdown(6);
          circleScale.value = withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) });
          circleOpacity.value = withTiming(0.6, { duration: 6000 });
          countdownId = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);

          timeoutId = setTimeout(() => {
            clearInterval(countdownId);
            if (isRunning) runCycle();
          }, 6000);
        }, 2000);
      }, 4000);
    };

    runCycle();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(countdownId);
    };
  }, [isRunning]);

  // Ambient pulse
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: circleOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    stopBreathing();
  };

  const handleComplete = async () => {
    stopBreathing();
    if (exercise) {
      await saveExerciseComplete({
        exerciseId: exercise.id,
        exerciseName: exercise.title,
        completedAt: new Date().toISOString(),
        duration: exercise.duration,
      });
    }
    setShowComplete(true);
  };

  if (!exercise) return null;

  const phaseConfig = PHASE_CONFIG[phase];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Completion modal */}
      <Modal visible={showComplete} transparent animationType="fade">
        <View style={styles.completionBackdrop}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.completionCard}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>Tebrikler!</Text>
            <Text style={styles.completionSub}>Egzersizi başarıyla tamamladınız.</Text>
            <Button
              title="Ana Sayfaya Dön"
              onPress={() => {
                setShowComplete(false);
                router.push('/screens/');
              }}
              style={{ marginTop: SPACING.lg }}
            />
          </Animated.View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </Pressable>

        {/* Hero header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
          <View style={[styles.heroEmojiBox, { backgroundColor: exercise.colorLight }]}>
            <Text style={styles.heroEmoji}>{exercise.emoji}</Text>
          </View>
          <View style={styles.heroInfo}>
            <Badge label={`${exercise.duration} dakika`} variant="primary" />
            <Text style={styles.heroTitle}>{exercise.title}</Text>
            <Text style={styles.heroSubtitle}>{exercise.subtitle}</Text>
          </View>
        </Animated.View>

        {/* Breathing guide circle */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.breathingSection}>
            <Text style={styles.breathingLabel}>
              {isRunning ? 'Nefes Rehberi' : 'Nefes Rehberi'}
            </Text>

            <View style={styles.circleContainer}>
              {/* Outer glow pulse */}
              <Animated.View
                style={[
                  styles.circleGlow,
                  pulseStyle,
                  { backgroundColor: phaseConfig.color + '18' },
                ]}
              />
              {/* Main animated circle */}
              <Animated.View
                style={[
                  styles.circle,
                  circleStyle,
                  { backgroundColor: phaseConfig.color + '28', borderColor: phaseConfig.color },
                ]}>
                <View style={[styles.circleInner, { backgroundColor: phaseConfig.color + '15' }]}>
                  <Text style={[styles.circlePhaseText, { color: phaseConfig.color }]}>
                    {isRunning ? phaseConfig.label : ''}
                  </Text>
                  {isRunning && countdown > 0 && (
                    <Text style={[styles.circleCountdown, { color: phaseConfig.color }]}>
                      {countdown}
                    </Text>
                  )}
                  {!isRunning && (
                    <Text style={styles.circleIdleText}>▶</Text>
                  )}
                </View>
              </Animated.View>
            </View>

            <View style={styles.breathingBtns}>
              {!isRunning ? (
                <Pressable style={styles.startCircleBtn} onPress={handleStart}>
                  <Text style={styles.startCircleBtnText}>Başlat</Text>
                </Pressable>
              ) : (
                <View style={styles.runningBtns}>
                  <Pressable style={styles.stopBtn} onPress={handleStop}>
                    <Text style={styles.stopBtnText}>Durdur</Text>
                  </Pressable>
                  <Pressable style={styles.completeBtn} onPress={handleComplete}>
                    <Text style={styles.completeBtnText}>Tamamla ✓</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.sectionText}>{exercise.description}</Text>
        </Animated.View>

        {/* Steps */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Adımlar</Text>
          {exercise.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Warning */}
        {exercise.warning && (
          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️  Önemli Uyarı</Text>
            <Text style={styles.warningText}>{exercise.warning}</Text>
          </Animated.View>
        )}

        {/* CTA */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.ctaSection}>
          <Button
            title={isRunning ? 'Egzersiz Devam Ediyor...' : 'Egzersizi Başlat'}
            onPress={handleStart}
            disabled={isRunning}
            size="lg"
          />
        </Animated.View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.base,
  },
  backText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOW.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  heroEmojiBox: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  heroEmoji: { fontSize: 72 },
  heroInfo: {
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  heroTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  breathingSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
    gap: SPACING.base,
  },
  breathingLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  circleContainer: {
    width: CIRCLE_SIZE + 60,
    height: CIRCLE_SIZE + 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGlow: {
    position: 'absolute',
    width: CIRCLE_SIZE + 60,
    height: CIRCLE_SIZE + 60,
    borderRadius: (CIRCLE_SIZE + 60) / 2,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: CIRCLE_SIZE - 20,
    height: CIRCLE_SIZE - 20,
    borderRadius: (CIRCLE_SIZE - 20) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  circlePhaseText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  circleCountdown: {
    fontSize: FONT_SIZE.xxxl + 4,
    fontWeight: '800',
    lineHeight: 40,
  },
  circleIdleText: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textLight,
  },
  breathingBtns: { width: '100%' },
  startCircleBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  startCircleBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.base,
  },
  runningBtns: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  stopBtn: {
    flex: 1,
    backgroundColor: COLORS.warningLight,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
  },
  stopBtnText: {
    color: COLORS.warning,
    fontWeight: '700',
    fontSize: FONT_SIZE.base,
  },
  completeBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  completeBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.base,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    ...SHADOW.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  warningBox: {
    backgroundColor: COLORS.warningLight,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.warningBorder,
    gap: SPACING.sm,
  },
  warningTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.warning,
  },
  warningText: {
    fontSize: FONT_SIZE.base,
    color: '#C0392B',
    lineHeight: 22,
  },
  ctaSection: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.base,
  },
  completionBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  completionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    ...SHADOW.lg,
    gap: SPACING.sm,
  },
  completionEmoji: { fontSize: 56 },
  completionTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  completionSub: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
