import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

interface InputProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  error?: string | null;
  inputContainerStyle?: ViewStyle; // Optional style prop for input container
  iconName: keyof typeof Ionicons.glyphMap; // Optional prop for the icon name
  onSubmitEditing?: () => void; // Function to handle submit editing
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      value,
      placeholder,
      onChangeText,
      secureTextEntry = false,
      showPassword,
      togglePasswordVisibility,
      error,
      inputContainerStyle,
      iconName,
      onSubmitEditing, // Accept the submit editing function
    },
    ref // Receive the ref
  ) => (
    <View style={[styles.inputContainer, inputContainerStyle]}>
      <Ionicons name={iconName} size={20} color="#000" style={styles.icon} />
      <TextInput
        ref={ref} // Set the ref to the TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor="#808080"
        secureTextEntry={secureTextEntry && !showPassword}
        style={styles.input}
        onSubmitEditing={onSubmitEditing} // Handle submit editing
        returnKeyType="next" // Change the return key type to "next"
      />
      {secureTextEntry && (
        <Ionicons
          name={showPassword ? "eye" : "eye-off"}
          size={20}
          color="#000"
          onPress={togglePasswordVisibility}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
);

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins",
  },
  icon: {
    marginRight: 10,
  },
  errorText: {
    color: "red",
    paddingTop: 5,
    fontFamily: "Poppins",
    fontSize: 12,
  },
});

export default Input;
