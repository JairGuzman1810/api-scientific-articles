import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  isLoading: boolean;
  onPress: () => void;
  disabled: boolean;
  buttonText: string;
  style?: ViewStyle; // Optional style prop
}

const Button = ({
  isLoading,
  onPress,
  disabled,
  buttonText,
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
      <Text style={styles.buttonText}>{buttonText}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    backgroundColor: "#57BBBF",
    borderRadius: 50,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
    paddingVertical: 15,
  },
  buttonText: {
    color: "#FCFCFC",
    fontFamily: "Poppins-Semibold",
  },
});

export default Button;
