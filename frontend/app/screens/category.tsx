import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '@/lib/constants';
import { CATEGORIES, EXERCISES } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const category = CATEGORIES.find((c) => c.id === id);
  const exercises = EXERCISES.filter((e) => e.category === id);

  const handleBack = () => router.back();

  const handleExercisePress = (exerciseId: string) => {
    router.push(`/screens/exercise?id=${exerciseId}`);
  };

  if (!category) return null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: category.color }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </Pressable>
        <View style={styles.headerInfo}>
          <View style={[styles.headerEmoji, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={{ fontSize: 36 }}>{category.emoji}</Text>
          </View>
          <Text style={styles.headerTitle}>{category.title}</Text>
          <Text style={styles.headerSub}>{exercises.length} egzersiz</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: COLORS.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {exercises.map((exercise, index) => (
          <Animated.View
            key={exercise.id}
            entering={FadeInDown.delay(index * 80).duration(450)}>
            <ExerciseCard
              exercise={exercise}
              onPress={() => handleExercisePress(exercise.id)}
              accentColor={category.color}
            />
          </Animated.View>
        ))}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface ExerciseCardProps {
  exercise: (typeof EXERCISES)[0];
  onPress: () => void;
  accentColor: string;
}

function ExerciseCard({ exercise, onPress, accentColor }: ExerciseCardProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const diffLabel = { kolay: 'Kolay', orta: 'Orta', zor: 'Zor' }[exercise.difficulty];
  const diffVariant = { kolay: 'success', orta: 'teal', zor: 'warning' }[
    exercise.difficulty
  ] as any;

  return (
    <Animated.View style={[anim, styles.cardWrap]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={styles.card}>
        <View style={[styles.cardLeft, { backgroundColor: accentColor + '18' }]}>
          <Text style={styles.cardEmoji}>{exercise.emoji}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{exercise.title}</Text>
          </View>
          <Text style={styles.cardSub}>{exercise.subtitle}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {exercise.description}
          </Text>
          <View style={styles.cardFooter}>
            <Badge label={`${exercise.duration} dk`} variant="primary" />
            <Badge label={diffLabel} variant={diffVariant} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.md,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
  },
  backText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZE.sm },
  headerInfo: { alignItems: 'center', gap: SPACING.sm },
  headerEmoji: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.base,
  },
  cardWrap: { marginBottom: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOW.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  cardLeft: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 30 },
  cardContent: {
    flex: 1,
    padding: SPACING.base,
    gap: 3,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  cardDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
});
