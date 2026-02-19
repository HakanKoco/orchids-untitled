import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '@/lib/constants';
import { ADMIN_STATS } from '@/lib/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.base * 2 - SPACING.sm) / 2;

const RECENT_ACTIVITY = [
  { id: '1', type: 'exercise', text: 'Yeni egzersiz eklendi', time: '2 saat önce', emoji: '🏃' },
  { id: '2', type: 'user', text: 'Yeni kullanıcı kaydı: Mehmet A.', time: '4 saat önce', emoji: '👤' },
  { id: '3', type: 'blog', text: '"KOAH ve Yaşam Kalitesi" yayınlandı', time: '1 gün önce', emoji: '📝' },
  { id: '4', type: 'support', text: 'Destek talebi çözüldü #023', time: '2 gün önce', emoji: '✅' },
  { id: '5', type: 'user', text: '28 yeni kullanıcı bu ay', time: '3 gün önce', emoji: '📊' },
];

const QUICK_ACTIONS = [
  { id: '1', label: 'Egzersiz Ekle', emoji: '➕', color: COLORS.primaryLight, textColor: COLORS.primary },
  { id: '2', label: 'Blog Yaz', emoji: '✏️', color: '#EFF6FF', textColor: '#2563EB' },
  { id: '3', label: 'Kullanıcılar', emoji: '👥', color: '#F5F3FF', textColor: '#7C3AED' },
  { id: '4', label: 'Destek', emoji: '🎧', color: '#FFF7ED', textColor: '#EA580C' },
];

export default function AdminScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'gün' | 'hafta' | 'ay'>('hafta');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </Pressable>
        <View>
          <Text style={styles.headerLabel}>Yönetim Paneli</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>Admin</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Period selector */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.periodRow}>
          {(['gün', 'hafta', 'ay'] as const).map((p) => (
            <Pressable
              key={p}
              style={[styles.periodBtn, selectedPeriod === p && styles.periodBtnActive]}
              onPress={() => setSelectedPeriod(p)}>
              <Text
                style={[
                  styles.periodBtnText,
                  selectedPeriod === p && styles.periodBtnTextActive,
                ]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>
        </Animated.View>
        <View style={styles.statsGrid}>
          {ADMIN_STATS.map((stat, index) => (
            <Animated.View
              key={stat.id}
              entering={FadeInDown.delay(200 + index * 60).duration(450)}>
              <StatCard stat={stat} />
            </Animated.View>
          ))}
        </View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(450).duration(400)}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Hızlı İşlemler</Text>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <QuickAction key={action.id} action={action} />
          ))}
        </Animated.View>

        {/* Recent activity */}
        <Animated.View entering={FadeInDown.delay(550).duration(400)}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Son Aktiviteler</Text>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={styles.activityCard}>
          {RECENT_ACTIVITY.map((item, index) => (
            <View key={item.id}>
              <View style={styles.activityRow}>
                <View style={styles.activityEmoji}>
                  <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                </View>
                <View style={styles.activityText}>
                  <Text style={styles.activityTitle}>{item.text}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
              {index < RECENT_ACTIVITY.length - 1 && <View style={styles.activityDivider} />}
            </View>
          ))}
        </Animated.View>

        {/* App info */}
        <Animated.View entering={FadeInDown.delay(650).duration(400)} style={styles.appInfoCard}>
          <Text style={styles.appInfoTitle}>KOAH Rehab v1.0.0</Text>
          <Text style={styles.appInfoSub}>Son güncelleme: Şubat 2026</Text>
          <View style={styles.appInfoBadges}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Sistem Aktif</Text>
          </View>
        </Animated.View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  stat: (typeof ADMIN_STATS)[0];
}

function StatCard({ stat }: StatCardProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[anim, { width: CARD_WIDTH }]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={[styles.statCard, { backgroundColor: stat.colorLight }]}>
        {/* Top row */}
        <View style={styles.statTopRow}>
          <View style={[styles.statIconBox, { backgroundColor: stat.color + '22' }]}>
            <Text style={{ fontSize: 22 }}>{stat.icon}</Text>
          </View>
          <View style={[styles.statTrend, { backgroundColor: stat.color + '18' }]}>
            <Text style={[styles.statTrendText, { color: stat.color }]}>↑</Text>
          </View>
        </View>
        {/* Value */}
        <Text style={[styles.statValue, { color: stat.color }]}>
          {stat.value.toLocaleString('tr-TR')}
        </Text>
        {/* Title */}
        <Text style={styles.statTitle}>{stat.title}</Text>
        {/* Change */}
        <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
      </Pressable>
    </Animated.View>
  );
}

interface QuickActionProps {
  action: (typeof QUICK_ACTIONS)[0];
}

function QuickAction({ action }: QuickActionProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[anim, { flex: 1 }]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.93))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={[styles.quickCard, { backgroundColor: action.color }]}>
        <Text style={{ fontSize: 24 }}>{action.emoji}</Text>
        <Text style={[styles.quickLabel, { color: action.textColor }]}>{action.label}</Text>
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
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  backText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
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
    letterSpacing: -0.3,
  },
  adminBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.base,
  },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },
  periodBtnActive: {
    backgroundColor: COLORS.primary,
    ...SHADOW.sm,
  },
  periodBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  periodBtnTextActive: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    gap: SPACING.xs,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    minHeight: 140,
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTrend: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTrendText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  statValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 36,
  },
  statTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statChange: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    gap: SPACING.xs,
    minWidth: (width - SPACING.base * 2 - SPACING.sm) / 2,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  quickLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    gap: SPACING.md,
  },
  activityEmoji: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityText: { flex: 1, gap: 2 },
  activityTitle: {
    fontSize: FONT_SIZE.sm + 1,
    fontWeight: '600',
    color: COLORS.text,
  },
  activityTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  activityDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.base,
  },
  appInfoCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryMid,
    gap: SPACING.xs,
  },
  appInfoTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  appInfoSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  appInfoBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
});
