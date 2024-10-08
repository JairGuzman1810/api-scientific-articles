import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  isLoading?: boolean;
  onPress: () => void;
  disabled?: boolean;
  buttonText?: string; // Optional button text
  iconName?: keyof typeof Ionicons.glyphMap; // Optional icon name
  iconSize?: number; // Optional icon size
  iconColor?: string; // Optional icon color
  style?: ViewStyle; // Optional style prop
}

const Button = ({
  isLoading = false,
  onPress,
  disabled = false,
  buttonText,
  iconName,
  iconSize = 24, // Default icon size
  iconColor = "#FFF", // Default icon color
  style, // Destructure the style prop
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || isLoading}
    style={[styles.button, style, disabled && styles.disabledButton]} // Combine styles
  >
    {isLoading ? (
      <ActivityIndicator color={"#FFF"} />
    ) : (
      <View style={styles.content}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={buttonText ? styles.iconWithText : undefined} // Add margin if text is present
          />
        )}
        {buttonText && <Text style={styles.buttonText}>{buttonText}</Text>}
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    backgroundColor: "#57BBBF",
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
    paddingVertical: 15,
  },
  buttonText: {
    color: "#FCFCFC",
    fontFamily: "Poppins-Semibold",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWithText: {
    marginRight: 8, // Adjust spacing between icon and text
  },
});

export default Button;
