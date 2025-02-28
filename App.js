import "react-native-gesture-handler";
import { useEffect } from "react";
import { ExpoRoot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <>
      <ExpoRoot />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}
