import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs, useSegments } from "expo-router";
import React from "react";
import { Image, Pressable, View } from "react-native";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import useAuth from "@/src/hooks/useAuth";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segment = useSegments();

  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Redirect href={"/(auth)"} />;
  }

  console.log(segment);

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
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <Image
                source={require("../../assets/images/logo.png")} // Replace with your image URL
                style={{ width: 40, height: 40, resizeMode: "contain" }}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleStyle: {
            fontFamily: "Nunito-Semibold",
            color: "#57BBBF",
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <Image
                source={require("../../assets/images/logo.png")} // Replace with your image URL
                style={{ width: 40, height: 40, resizeMode: "contain" }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
