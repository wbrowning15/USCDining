// (tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabsLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide header for all tabs
      }}
    >
      <Tabs.Screen
        name="evk"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="village"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="star" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="parkside"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="retweet" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
