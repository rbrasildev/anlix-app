import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="apply"
        options={{
          title: 'Aplicar',
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
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Configurar dados de acesso',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'cog' : 'cog-outline'} size={32} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
