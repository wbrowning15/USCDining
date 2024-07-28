import * as Notifications from 'expo-notifications';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      console.log("Initializing push notifications...");

      let token;
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
        try {
          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
          console.log("Push token set: ", token);
          setExpoPushToken(token);
        } catch (error) {
          console.error("Error getting push token: ", error);
          alert('Failed to get push token. Push notifications may not work on simulators.');
        }
      } else {
        console.warn('Project ID is missing');
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  return expoPushToken;
};
