// (tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';

export default function TabsLayout() {
  const iconSize = 24; // Define your icon size

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
            <View>
              <Image
                source={require('../../assets/evkIcon.jpg')} // Use PNG format
                style={{ width: iconSize, height: iconSize }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="village"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image
                source={require('../../assets/villageIcon.webp')} // Use PNG format
                style={{ width: iconSize, height: iconSize }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="parkside"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image
                source={require('../../assets/parksideIcon.jpg')} // Use PNG format
                style={{ width: iconSize, height: iconSize }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
