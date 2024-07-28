import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const sendPushNotification = async (
  expoPushToken: string, title: string, body: string) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: {body},
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

exports.sendNotifications = functions.firestore
  .document("menus/{date}")
  .onUpdate(async (change) => {
    const newData = change.after.data();
    const prevData = change.before.data();

    try {
      const snapshot = await admin.firestore().collection("users").get();

      snapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const favorites = userData.favorites || [];
        const expoPushToken = userData.expoPushToken;

        if (expoPushToken) {
          favorites.forEach(async (favorite: string) => {
            const newFoods = newData.meals.breakfast["Everybody's Kitchen"];
            const oldFoods = prevData.meals.breakfast["Everybody's Kitchen"];

            newFoods.forEach((category: { foods: { food: string }[] }) => {
              category.foods.forEach(async (food: { food: string }) => {
                if (
                  food.food === favorite &&
                  !oldFoods.some((cat: { foods: { food: string }[] }) =>
                    cat.foods.some((f: { food: string }) =>
                      f.food === favorite))
                ) {
                  await sendPushNotification(
                    expoPushToken,
                    "Favorite Food Available",
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
      console.error("Error sending notifications:", error);
      return null;
    }
  });
