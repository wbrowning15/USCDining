/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const sendPushNotification = async (expoPushToken: string, title: string, body: string) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: { body },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};

exports.sendNotifications = functions.firestore
  .document('menus/{date}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    const date = context.params.date;

    try {
      const snapshot = await admin.firestore().collection('users').get();

      snapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const favorites = userData.favorites || [];
        const expoPushToken = userData.expoPushToken;

        if (expoPushToken) {
          favorites.forEach(async (favorite: string) => {
            const newFoods = newData.meals.breakfast["Everybody's Kitchen"];
            const oldFoods = previousData.meals.breakfast["Everybody's Kitchen"];

            newFoods.forEach((category: any) => {
              category.foods.forEach(async (food: any) => {
                if (
                  food.food === favorite &&
                  !oldFoods.some((cat: any) => cat.foods.some((f: any) => f.food === favorite))
                ) {
                  await sendPushNotification(
                    expoPushToken,
                    'Favorite Food Available',
                    `${food.food} is available at Everybody's Kitchen today!`
                  );
                }
              });
            });
          });
        }
      });

      return null;
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  });
