import * as Notifications from 'expo-notifications';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (projectId) {
          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
          console.log("token set: ", token);
          setExpoPushToken(token);

        } else {
          console.warn('Project ID is missing');
        }
      } else {
        alert('Must use physical device for Push Notifications');
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  return expoPushToken;
};
