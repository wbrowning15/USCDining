import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Dining Hall</Text>
      <TouchableOpacity style={styles.iconContainer} onPress={() => router.push('/(tabs)/evk')}>
        <Text style={styles.iconText}>EVK</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => router.push('/(tabs)/village')}>
        <Text style={styles.iconText}>Village</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => router.push('/(tabs)/parkside')}>
        <Text style={styles.iconText}>Parkside</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  iconContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  iconText: {
    fontSize: 18,
  },
});
