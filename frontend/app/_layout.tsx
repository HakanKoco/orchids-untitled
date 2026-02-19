import '@/global.css';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './error-boundary';

const KOAH_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5FAF8',
    primary: '#1FA67A',
    card: '#FFFFFF',
    text: '#1A2E26',
    border: '#D6EFE6',
    notification: '#FF6B6B',
  },
};

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider value={KOAH_THEME}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="screens/index" options={{ headerShown: false }} />
          <Stack.Screen name="screens/category" options={{ headerShown: false }} />
          <Stack.Screen name="screens/exercise" options={{ headerShown: false }} />
          <Stack.Screen name="screens/consent" options={{ headerShown: false }} />
          <Stack.Screen name="screens/admin" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
