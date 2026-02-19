import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  FadeInDown,
  FadeInUp,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '@/lib/constants';
import { CATEGORIES } from '@/lib/mockData';
import { WelcomeModal } from '@/components/WelcomeModal';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getProgress } from '@/lib/storage';

const { width } = Dimensions.get('window');

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  isinma: ['#1FA67A', '#2DC8A2'],
  nefes: ['#17A499', '#2ECBBF'],
  aksam: ['#2563EB', '#4F8EF7'],
};

const CATEGORY_IMAGES: Record<string, string> = {
  isinma: '🧘',
  nefes: '🌬️',
  aksam: '🌙',
};

export default function HomeScreen() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const headerAnim = useSharedValue(0);

  useEffect(() => {
    headerAnim.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress = await getProgress();
    if (progress) {
      setTotalCompleted(progress.completedExercises.length);
    }
  };

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: (1 - headerAnim.value) * -20 }],
  }));

  const handleStart = () => {
    setShowWelcome(false);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/screens/category?id=${categoryId}`);
  };

  const handleAdminPress = () => {
    router.push('/screens/admin');
  };

  const handleConsentPress = () => {
    router.push('/screens/consent');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState message="Egzersizler yükleniyor..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <WelcomeModal visible={showWelcome} onStart={handleStart} />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View>
          <Text style={styles.headerLabel}>KOAH Rehabilitasyon</Text>
          <Text style={styles.headerTitle}>KOAH Egzersiz</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileBtn} onPress={handleAdminPress}>
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Progress banner */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.progressBanner}>
            <View style={styles.progressLeft}>
              <Text style={styles.progressTitle}>Bugünkü İlerleme</Text>
              <Text style={styles.progressSub}>{totalCompleted} egzersiz tamamlandı</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{totalCompleted}</Text>
              <Text style={styles.progressBadgeLabel}>✓</Text>
            </View>
          </View>
        </Animated.View>

        {/* Section title */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Egzersiz Kategorileri</Text>
            <TouchableOpacity onPress={() => setShowEmpty(!showEmpty)}>
              <Text style={styles.sectionLink}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Empty state demo toggle */}
        {showEmpty ? (
          <Animated.View entering={FadeInDown.duration(400)}>
            <EmptyState
              title="Egzersiz bulunamadı"
              description="Şu an gösterilecek egzersiz yok. Daha sonra tekrar deneyin."
              icon="🌿"
            />
          </Animated.View>
        ) : (
          <>
            {CATEGORIES.map((cat, index) => (
              <Animated.View
                key={cat.id}
                entering={FadeInDown.delay(350 + index * 80).duration(500)}>
                <CategoryCard
                  category={cat}
                  onPress={() => handleCategoryPress(cat.id)}
                  gradient={CATEGORY_GRADIENTS[cat.id]}
                  imageEmoji={CATEGORY_IMAGES[cat.id]}
                />
              </Animated.View>
            ))}
          </>
        )}

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(650).duration(500)}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Hızlı Erişim</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          style={styles.quickActionsRow}>
          <QuickActionCard
            emoji="📋"
            label="Bilgilendirme"
            color={COLORS.primaryLight}
            textColor={COLORS.primary}
            onPress={handleConsentPress}
          />
          <QuickActionCard
            emoji="⚙️"
            label="Yönetim Paneli"
            color="#EFF6FF"
            textColor="#2563EB"
            onPress={handleAdminPress}
          />
          <QuickActionCard
            emoji="📊"
            label="İlerleme"
            color={COLORS.tealLight}
            textColor={COLORS.teal}
            onPress={() => {}}
          />
        </Animated.View>

        {/* Bottom padding */}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface CategoryCardProps {
  category: (typeof CATEGORIES)[0];
  onPress: () => void;
  gradient: [string, string];
  imageEmoji: string;
}

function CategoryCard({ category, onPress, gradient, imageEmoji }: CategoryCardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animStyle, styles.categoryCardWrap]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 20, stiffness: 300 });
        }}
        style={({ pressed }) => styles.categoryCard}>

        {/* Left colored accent */}
        <View style={[styles.cardAccent, { backgroundColor: category.color }]} />

        <View style={styles.cardBody}>
          {/* Image / emoji zone */}
          <View style={[styles.emojiBox, { backgroundColor: category.colorLight }]}>
            <Text style={styles.cardEmoji}>{imageEmoji}</Text>
          </View>

          <View style={styles.cardText}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>{category.title}</Text>
              <View style={[styles.countBadge, { backgroundColor: category.colorLight }]}>
                <Text style={[styles.countText, { color: category.color }]}>
                  {category.exerciseCount} egz.
                </Text>
              </View>
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {category.description}
            </Text>

            {/* CTA */}
            <View style={[styles.detailBtn, { backgroundColor: category.color }]}>
              <Text style={styles.detailBtnText}>Detaya Git →</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

interface QuickActionCardProps {
  emoji: string;
  label: string;
  color: string;
  textColor: string;
  onPress: () => void;
}

function QuickActionCard({ emoji, label, color, textColor, onPress }: QuickActionCardProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[anim, { flex: 1 }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.95))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={[styles.quickCard, { backgroundColor: color }]}>
        <Text style={styles.quickEmoji}>{emoji}</Text>
        <Text style={[styles.quickLabel, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: { fontSize: 22 },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -4,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.base,
  },
  progressBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    ...SHADOW.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressLeft: { gap: 3 },
  progressTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  progressBadge: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryMid,
  },
  progressBadgeText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 22,
  },
  progressBadgeLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
    lineHeight: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionLink: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryCardWrap: {
    marginBottom: SPACING.md,
  },
  categoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    ...SHADOW.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 110,
  },
  cardAccent: {
    width: 5,
    borderTopLeftRadius: RADIUS.xl,
    borderBottomLeftRadius: RADIUS.xl,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    padding: SPACING.base,
    alignItems: 'center',
    gap: SPACING.md,
  },
  emojiBox: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardEmoji: { fontSize: 32 },
  cardText: { flex: 1, gap: SPACING.xs },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  countBadge: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  countText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    lineHeight: 19,
  },
  detailBtn: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
  },
  detailBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  quickCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    gap: SPACING.xs,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  quickEmoji: { fontSize: 26 },
  quickLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
