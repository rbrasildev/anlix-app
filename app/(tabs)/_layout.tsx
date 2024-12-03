import { router, Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}  // Muda o estilo da barra de status
        backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}  // Muda a cor do fundo da barra de status
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            headerShown: true,
            headerBackgroundContainerStyle: { backgroundColor: '#' },
            headerLeft: () => (
              < MaterialCommunityIcons style={{ marginLeft: 15 }} name="tablet-dashboard" size={32} color="#87949D" />
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{ borderWidth: 0.3, borderColor: '#333', marginRight: 10, padding: 3, borderRadius: 5 }}
                onPress={() => {
                  router.push({
                    pathname: '/settings'
                  })
                }}
              >
                <MaterialCommunityIcons name="cog" size={32} color="#87949D" />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="apply"
          options={{
            title: 'Aplicar',
            headerShown: true,
            headerTitle:'Buscar cliente',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? 'wifi-cog' : 'wifi-cog'} size={32} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Scanner"
          options={{
            title: 'Buscar',
            headerShown: true,
            headerTitle: 'Lista MAC resetdefault',
            headerTintColor: '#666',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'search' : 'search-outline'} size={32} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="cto"
          options={{
            headerShown:true,
            headerTitle:'Informações da CTO',
            title: 'CTO',
            headerTintColor: '#333',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? 'package-variant' : 'package'} size={32} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="remove"
          options={{
            title: 'Remover',
            headerTitle: 'Remover roteador do anlix',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? 'wifi-cancel' : 'wifi-cancel'} size={32} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
