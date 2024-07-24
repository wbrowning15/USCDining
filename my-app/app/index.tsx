import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './firebaseConfig';
import { signInAnonymously, User } from 'firebase/auth';
import { useNotifications } from './notifications';

const IndexScreen: React.FC = () => {
  const router = useRouter();
  const { height } = Dimensions.get('window');
  const [loading, setLoading] = useState<boolean>(true);
  const expoPushToken = useNotifications();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userCredential = await signInAnonymously(auth);
        const user: User = userCredential.user;

        // Check if user exists in Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Store user in Firestore
          await setDoc(userDocRef, {
            uid: user.uid,
            favorites: [], // Initialize favorites array
          });
        }
        console.log("push token: ", expoPushToken);

        // Store the Expo push token in Firestore
        if (expoPushToken) {
          await setDoc(userDocRef, { expoPushToken }, { merge: true });
        }

      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [expoPushToken]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
