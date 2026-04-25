import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FavoritesProvider } from '@/hooks/use-favorites';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { LangProvider } from '@/hooks/use-lang';

export const unstable_settings = { initialRouteName: 'splash', anchor: '(tabs)' };

function AppStack() {
  const { scheme } = useTheme();
  return (
    <NavThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="recipe-detail" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LangProvider>
          <FavoritesProvider>
            <AppStack />
          </FavoritesProvider>
        </LangProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
