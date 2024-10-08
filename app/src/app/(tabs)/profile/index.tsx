import LogoutDrawer from "@/src/components/profile/LogoutDrawer";
import ProfileOption from "@/src/components/profile/ProfileOption";
import ProfileUser from "@/src/components/profile/ProfileUser";
import useAuth from "@/src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const { auth } = useAuth(); // Get the auth object from useAuth
  const user = auth?.user; // Destructure user from auth
  const router = useRouter();

  // Array of profile options
  const profileOptions = [
    {
      iconName: "person-outline",
      title: "Edit Profile",
      action: () => router.navigate("/profile/edit"),
    },
    {
      iconName: "cog-outline",
      title: "Settings",
      action: () => router.navigate("/profile/configurations"),
    },
    {
      iconName: "exit-outline",
      title: "Log Out",
      action: () => setIsDrawerVisible(true),
    },
  ];

  return (
    <View style={styles.container}>
      <ProfileUser name={`${user?.first_name} ${user?.last_name}`} />
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
      {isDrawerVisible && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsDrawerVisible(false)}
          activeOpacity={1}
        />
      )}

      <LogoutDrawer
        isVisible={isDrawerVisible}
        setIsVisible={setIsDrawerVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    opacity: 0.6,
    zIndex: 1,
  },
});
