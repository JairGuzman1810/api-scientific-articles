import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  error?: string | null;
  inputContainerStyle?: ViewStyle | ViewStyle[]; // Optional style prop for input container
  iconName: keyof typeof Ionicons.glyphMap; // Optional prop for the icon name
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      value,
      placeholder,
      onChangeText,
      secureTextEntry = false,
      showPassword = false,
      togglePasswordVisibility,
      error,
      inputContainerStyle,
      iconName,
      ...textInputProps // Spread TextInput props
    },
    ref // Receive the ref
  ) => (
    <>
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <Ionicons name={iconName} size={20} color="#000" style={styles.icon} />
        <TextInput
          ref={ref} // Set the ref to the TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          placeholderTextColor="#808080"
          secureTextEntry={secureTextEntry && !showPassword} // Correct condition
          style={styles.input}
          {...textInputProps} // Pass down TextInput props
        />
        {togglePasswordVisibility && ( // Ensure togglePasswordVisibility is defined
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#000"
            onPress={togglePasswordVisibility} // Ensure this is called
            style={styles.eyeIcon} // Add style for the eye icon
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
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
    position: "relative", // Position relative for better alignment
  },
  input: {
    flex: 1,
    fontFamily: "Poppins",
    height: "100%",
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginLeft: 10, // Optional margin for better spacing
  },
  errorText: {
    color: "red",
    fontFamily: "Poppins",
    fontSize: 12,
    marginLeft: 10,
    marginTop: -5,
  },
});

export default Input;
