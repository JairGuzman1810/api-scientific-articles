import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
} from "@/src/helpers/userUtils";
import { useRegister } from "@/src/hooks/useUsers";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();

  const lastNameInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleRegister = () => {
    register(
      { first_name: firstName, last_name: lastName, username, password },
      {
        onSuccess: () => {
          router.replace("/articles");
        },
      }
    );
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    const error = validateFirstName(text); // Validate on change
    setFirstNameError(error); // Update email error state
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    const error = validateLastName(text); // Validate on change
    setLastNameError(error); // Update email error state
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
    firstName !== "" &&
    lastName !== "" &&
    username !== "" &&
    password !== "" &&
    !firstNameError &&
    !lastNameError &&
    !usernameError &&
    !passwordError;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          value={firstName}
          placeholder="First Name"
          onChangeText={handleFirstNameChange}
          error={firstNameError}
          inputContainerStyle={styles.input}
          iconName="person"
          onSubmitEditing={() => lastNameInputRef.current?.focus()}
          inputMode="text"
        />
        <Input
          ref={lastNameInputRef}
          value={lastName}
          placeholder="Last Name"
          onChangeText={handleLastNameChange}
          error={lastNameError}
          inputContainerStyle={styles.input}
          iconName="person"
          onSubmitEditing={() => usernameInputRef.current?.focus()}
          inputMode="text"
        />
        <Input
          ref={usernameInputRef}
          value={username}
          placeholder="Email"
          onChangeText={handleUsernameChange} // Use the new handler for real-time validation
          error={usernameError}
          inputContainerStyle={styles.input}
          iconName="mail"
          onSubmitEditing={() => passwordInputRef.current?.focus()} // Focus on password input
          inputMode="email"
        />
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
          inputMode="text"
        />
      </View>
      <Button
        isLoading={isPending}
        onPress={handleRegister}
        disabled={!isFormComplete || isPending} // Disable button if inputs are empty
        buttonText="Register"
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
