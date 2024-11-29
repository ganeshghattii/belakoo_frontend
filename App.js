import "react-native-gesture-handler";
import { useEffect } from "react";
import { ExpoRoot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from "./Components/RegisterPushNotification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    async function tokenRegister() {
      const token = await registerForPushNotificationsAsync();
      console.log(token);
    }

    // Handle received notifications
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    // Handle notification responses (when user taps)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        // Navigate based on notification data
        if (data.notification_type === "lesson_completion") {
          // Navigate to lesson details
          navigation.navigate("LessonDetails", { lessonId: data.lesson_id });
        }

        console.log(data);
      });

    tokenRegister();

    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Load resources here (fonts, data, etc.)
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return <ExpoRoot />;
}
