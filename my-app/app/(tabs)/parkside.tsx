import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ParksideScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parkside Dining Hall</Text>
      <Text>No menu data available.</Text>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/index')}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/evk')}>
          <Text style={styles.navButtonText}>EVK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/village')}>
          <Text style={styles.navButtonText}>Village</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 5,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
