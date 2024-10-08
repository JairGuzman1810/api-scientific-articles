import ProfileUser from "@/src/components/profile/ProfileUser";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
} from "@/src/helpers/userUtils";
import useAuth from "@/src/hooks/useAuth";
import { useUpdateUser } from "@/src/hooks/useUsers";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const { auth } = useAuth();
  const user = auth?.user;
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const router = useRouter();

  const handleUpdate = () => {
    updateUser(
      {
        userId: String(user?.id),
        first_name: firstName,
        last_name: lastName,
        username,
      },
      {
        onSuccess: () => {
          // Show alert
          Alert.alert(
            "Success",
            `Your profile has been updated successfully!`, // More personal message
            [
              {
                text: "Confirm",
                onPress: () => {
                  // Add any code you want to execute upon confirmation
                  router.dismiss(); // This is the code you want to use to close the screen
                },
              },
            ],
            { cancelable: false } // This property ensures the alert cannot be dismissed by touching outside of it
          );
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

  const isFormComplete =
    firstName !== "" &&
    lastName !== "" &&
    username !== "" &&
    !firstNameError &&
    !lastNameError &&
    !usernameError;

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
        <ProfileUser name={`${firstName} ${lastName}`} />
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
            inputMode="email"
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          isLoading={isPending}
          onPress={handleUpdate}
          disabled={!isFormComplete || isPending} // Disable button if inputs are empty
          buttonText="Update"
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
  },
  inputContainer: {
    flexGrow: 1, // Allow inputs to grow and fill the available space
    paddingHorizontal: 10,
  },
  input: {
    marginBottom: 10, // Space between inputs
    paddingVertical: 18,
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
