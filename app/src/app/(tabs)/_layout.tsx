import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs, useRouter, useSegments } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import useAuth from "@/src/hooks/useAuth";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segment = useSegments();
  const router = useRouter();

  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Redirect href={"/(auth)"} />;
  }

  // Condicional para mostrar la flecha de retroceso si segment[2] no es undefined
  const showBackButton = segment[2] !== undefined;

  function getProfileTitle(segment: string[]): string {
    switch (segment[2]) {
      case "edit":
        return "Edit Profile";
      case "configuration":
        return "Profile Configuration";
      case "settings":
        return "Profile Settings";
      default:
        return "Profile";
    }
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="articles"
        options={{
          title: "Articles",
          headerTitleStyle: {
            fontFamily: "Nunito-Semibold",
            color: "#57BBBF",
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="document-text" color={color} />
          ),
          // Si se debe mostrar el botón de retroceso
          headerLeft: showBackButton
            ? () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={Colors[colorScheme ?? "light"].tint}
                    style={{ marginLeft: 15 }}
                  />
                </TouchableOpacity>
              )
            : undefined,
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: 40, height: 40, resizeMode: "contain" }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: getProfileTitle(segment),
          headerTitleStyle: {
            fontFamily: "Nunito-Semibold",
            color: "#57BBBF",
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
          headerLeft: showBackButton
            ? () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={Colors[colorScheme ?? "light"].tint}
                    style={{ marginLeft: 15 }}
                  />
                </TouchableOpacity>
              )
            : undefined,
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: 40, height: 40, resizeMode: "contain" }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
