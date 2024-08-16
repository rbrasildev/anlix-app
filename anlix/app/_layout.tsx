import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import Settings from './settings';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [auth, setAuth] = useState([]);

  const { getItem, removeItem } = useAsyncStorage('@anlix:auth');

  async function anlixFetchData() {
    const response = await getItem();

    setAuth(JSON.parse(response));
  }


  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    anlixFetchData()
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
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
          <Stack.Screen name="CtoInfo"
            options={{
              headerTitle: 'Informações da CTO',
              headerTintColor: '#666',

            }}
          />
          <Stack.Screen name="settings"
            options={{
              headerShown: false,
              headerTitle: 'Configurações de acesso',
              headerTintColor: '#666',

            }}
          />
        </Stack>
      </ThemeProvider>
      <Toast />
    </>
  );
}
