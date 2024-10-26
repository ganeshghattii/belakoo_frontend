import { Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Text } from "react-native";

import { MyProvider } from "../context/context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    gothambold: require("../assets/fonts/GothamMedium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  // Set the default font family for all Text components
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: "gothambold" };

  return (
      <MyProvider>
        <Slot />
      </MyProvider>
  );
}
