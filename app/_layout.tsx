import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="Roteador" />
        <Stack.Screen name="Device" />
        <Stack.Screen name="Cliente" options={() => ({
          title: 'Buscar MAC (resetdefault)',
          headerStyle: {
            ...DarkTheme
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: 'Device'
                })
              }}
            >
              <MaterialIcons name="search" size={32} color="#87949D" />
            </TouchableOpacity>
          ),
        })} />
      </Stack>
    </ThemeProvider>
  );
}
