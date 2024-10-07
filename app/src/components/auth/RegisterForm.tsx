import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleRegister = () => {
    // Register logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          value={firstName}
          placeholder="First Name"
          onChangeText={setFirstName}
          error={firstNameError}
          inputContainerStyle={styles.input}
          iconName="person"
          onSubmitEditing={() => lastNameInputRef.current?.focus()}
        />
        <Input
          ref={lastNameInputRef}
          value={lastName}
          placeholder="Last Name"
          onChangeText={setLastName}
          error={lastNameError}
          inputContainerStyle={styles.input}
          iconName="person"
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />
        <Input
          ref={emailInputRef}
          value={email}
          placeholder="Email"
          onChangeText={setEmail}
          error={emailError}
          inputContainerStyle={styles.input}
          iconName="mail"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <Input
          ref={passwordInputRef}
          value={password}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
          showPassword={showPassword}
          togglePasswordVisibility={() => setShowPassword(!showPassword)}
          error={passwordError}
          inputContainerStyle={styles.input}
          iconName="lock-closed"
        />
      </View>
      <Button
        isLoading={isLoading}
        onPress={handleRegister}
        disabled={!email || !password}
        buttonText="Register"
        style={styles.button}
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
  button: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#57BBBF",
    borderRadius: 50,
    marginTop: 10, // Ensure space between inputs and button
  },
});
