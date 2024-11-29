import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    // Android-specific setup
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    // Check permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    // Get Expo push token
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "ff4647f1-1086-4d00-a1dc-66312068abde", // Get this from app.json or app.config.js
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default registerForPushNotificationsAsync;
