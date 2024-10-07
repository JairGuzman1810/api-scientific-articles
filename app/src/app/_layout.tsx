import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/src/components/useColorScheme";
import { Platform, StatusBar } from "react-native";
import Colors from "../constants/Colors";
import QueryProvider from "../providers/QueryProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Nunito: require("@/fonts/Nunito-Regular.ttf"),
    "Nunito-Semibold": require("@/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("@/fonts/Nunito-Bold.ttf"),
    Poppins: require("@/fonts/Poppins-Regular.ttf"),
    "Poppins-Semibold": require("@/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/fonts/Poppins-Bold.ttf"),
    Lato: require("@/fonts/Lato-Regular.ttf"),
    "Lato-Semibold": require("@/fonts/Lato-SemiBold.ttf"),
    "Lato-Italic": require("@/fonts/Lato-Italic.ttf"),
    "Lato-Bold": require("@/fonts/Lato-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync(
      Colors[colorScheme ?? "light"].background
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={Colors[colorScheme ?? "light"].background}
        />
      </QueryProvider>
    </ThemeProvider>
  );
}
