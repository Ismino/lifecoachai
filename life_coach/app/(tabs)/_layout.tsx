/*/import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
/*/

// Importerar navigeringskomponenterna från Expo Router
import { Stack, Tabs } from 'expo-router'; 

// Layout-funktion för att definiera navigeringsstacken
export default function Layout() {
  return (
    <Stack>
      {/* Definierar en stack-baserad navigation */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      {/* Skärmar i stacken:
          - "index": Startskärmen med titeln "Home" i appens header. */}

      <Stack.Screen name="login" options={{ title: 'Login' }} />
      {/* Skärm för inloggning, med titeln "Login". */}

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* En undernivå för flik-baserad navigation (tabs). 
          - "headerShown: false" döljer huvudrubriken för denna stack. */}
    </Stack>
  );
}

// Funktion för att definiera flikarna (tabs) i appen
export function TabsLayout() {
  return (
    <Tabs>
      {/* Flik-baserad navigation för applikationen */}
      <Tabs.Screen name="MainScreen" options={{ title: 'Sessions' }} />
      {/* Första fliken: Visar "Sessions" som titeln och pekar på "MainScreen". */}

      <Tabs.Screen name="DetailScreen" options={{ title: 'Details' }} />
      {/* Andra fliken: Visar "Details" som titeln och pekar på "DetailScreen". */}
    </Tabs>
  );
}





