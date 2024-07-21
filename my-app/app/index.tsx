import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';

const IndexScreen: React.FC = () => {
  const router = useRouter();
  const { height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.section, { height: height / 3 }]} 
        onPress={() => router.push('/(tabs)/evk')}
      >
        <Image 
          source={require('../assets/evk1.jpg')} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.section, { height: height / 3 }]} 
        onPress={() => router.push('/(tabs)/village')}
      >
        <Image 
          source={require('../assets/village.jpg')} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.section, { height: height / 3 }]} 
        onPress={() => router.push('/(tabs)/parkside')}
      >
        <Image 
          source={require('../assets/parkside1.jpg')} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default IndexScreen;
