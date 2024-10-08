import { ScrollView, StyleSheet, View } from "react-native";

import ProfileOption from "@/src/components/profile/ProfileOption";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

export default function ConfigurationScreen() {
  const router = useRouter();
  const profileOptions = [
    {
      iconName: "lock-open-outline",
      title: "Change Password",
      action: () => router.navigate("/profile/configurations/change"),
    },
    {
      iconName: "trash-outline",
      title: "Delete Account",
      action: () => router.navigate("/profile/configurations/delete"),
    },
  ];
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {profileOptions.map((option, index) => (
          <ProfileOption
            key={index}
            iconName={option.iconName as keyof typeof Ionicons.glyphMap}
            title={option.title}
            onPress={option.action}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
});
