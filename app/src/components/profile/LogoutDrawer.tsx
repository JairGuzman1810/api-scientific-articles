import Colors from "@/src/constants/Colors";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import useAuth from "../../hooks/useAuth";
import { Text } from "../Themed";

const { height: screenHeight } = Dimensions.get("window");

type LogoutDrawerProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

export default function LogoutDrawer({
  isVisible,
  setIsVisible,
}: LogoutDrawerProps) {
  const colorScheme = useColorScheme();
  const { handleLogout: logOut } = useAuth();
  const router = useRouter();
  const initialHeight = Math.min(
    screenHeight * 0.18,
    Platform.OS === "ios" ? 135 : 145
  ); // Min height of 120px or 18% of screen height
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isVisible ? initialHeight : 0,
      duration: 300, // Adjust the duration as needed
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start();
  }, [animatedHeight, initialHeight, isVisible]);

  const handleCancel = () => {
    setIsVisible(false);
  };

  const handleLogout = () => {
    logOut();
    router.replace("/(auth)");
  };

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          height: animatedHeight,
          backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Are you sure you want to log out?</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.confirmText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 2, // Ensure the drawer is above the overlay
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 50,
  },
  cancelText: {
    fontFamily: "Poppins-Semibold",
    fontSize: 14,
  },
  confirmText: {
    fontFamily: "Poppins-Semibold",
    fontSize: 14,
    color: "#FFF",
  },
  logoutButton: {
    backgroundColor: "#57BBBF",
  },
});
