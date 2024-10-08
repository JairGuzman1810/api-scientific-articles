import { validateEmail, validatePassword } from "@/src/helpers/userUtils";
import { useLogin } from "@/src/hooks/useUsers";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const router = useRouter();

  const passwordInputRef = useRef<TextInput>(null); // Ref for the password input

  const handleLogin = () => {
    login(
      { username, password },
      {
        onSuccess: () => {
          router.replace("/articles");
        },
      }
    );
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    const error = validateEmail(text); // Validate on change
    setUsernameError(error); // Update email error state
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const error = validatePassword(text); // Validate on change
    setPasswordError(error); // Update password error state
  };

  const isFormComplete =
    username !== "" && password !== "" && !usernameError && !passwordError;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 500 })}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Input
            value={username}
            placeholder="Email"
            onChangeText={handleUsernameChange} // Use the new handler for real-time validation
            error={usernameError}
            inputContainerStyle={styles.input}
            iconName="mail"
            onSubmitEditing={() => passwordInputRef.current?.focus()} // Focus on password input
            inputMode="email"
          />
          {/* Display email error */}
          <Input
            ref={passwordInputRef} // Assign the ref to the password input
            value={password}
            placeholder="Password"
            onChangeText={handlePasswordChange} // Use the new handler for real-time validation
            secureTextEntry={!showPassword}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            error={passwordError}
            inputContainerStyle={styles.input}
            iconName="lock-closed"
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          isLoading={isPending}
          onPress={handleLogin}
          disabled={!isFormComplete || isPending} // Disable button if inputs are empty
          buttonText="Login"
          style={styles.button} // Optional style for the button
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: "space-between", // Ensure spacing between inputs and button
    padding: 10,
  },
  inputContainer: {
    flexGrow: 1, // Allow inputs to grow and fill the available space
  },
  input: {
    marginBottom: 10, // Space between inputs
    paddingVertical: 18,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#57BBBF",
    borderRadius: 50,
    marginTop: 10, // Ensure space between inputs and button
  },
});
