import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProgressEntry {
  exerciseId: string;
  exerciseName: string;
  completedAt: string;
  duration: number;
}

export interface UserProgress {
  completedExercises: ProgressEntry[];
  totalMinutes: number;
  streak: number;
  lastActive: string;
}

const STORAGE_KEY = '@koah_progress';

export async function getProgress(): Promise<UserProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProgress;
  } catch {
    return null;
  }
}

export async function saveExerciseComplete(entry: ProgressEntry): Promise<void> {
  try {
    const current = await getProgress();
    const progress: UserProgress = current ?? {
      completedExercises: [],
      totalMinutes: 0,
      streak: 0,
      lastActive: '',
    };
    progress.completedExercises.push(entry);
    progress.totalMinutes += entry.duration;
    progress.lastActive = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // silently fail
  }
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
