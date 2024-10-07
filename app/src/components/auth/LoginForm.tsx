import { validateEmail, validatePassword } from "@/src/helpers/userUtils";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordInputRef = useRef<TextInput>(null); // Ref for the password input

  const handleLogin = () => {
    // If validation passes, you can proceed with the login logic here
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      // Handle successful login here
    }, 2000);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const error = validateEmail(text); // Validate on change
    setEmailError(error); // Update email error state
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const error = validatePassword(text); // Validate on change
    setPasswordError(error); // Update password error state
  };

  const isFormComplete =
    email !== "" && password !== "" && !emailError && !passwordError;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          value={email}
          placeholder="Email"
          onChangeText={handleEmailChange} // Use the new handler for real-time validation
          error={emailError}
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
      <Button
        isLoading={isLoading}
        onPress={handleLogin}
        disabled={!isFormComplete || isLoading} // Disable button if inputs are empty
        buttonText="Login"
        style={styles.button} // Optional style for the button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  button: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#57BBBF",
    borderRadius: 50,
    marginTop: 10, // Ensure space between inputs and button
  },
});
