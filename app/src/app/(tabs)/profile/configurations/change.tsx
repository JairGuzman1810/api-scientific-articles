import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import {
  validateConfirmPassword,
  validateNewPassword,
  validateOldPassword,
} from "@/src/helpers/profileUtils";
import useAuth from "@/src/hooks/useAuth";
import { useUpdatePassword } from "@/src/hooks/useUsers";
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

export default function ChangePasswordScreen() {
  const { auth } = useAuth();
  const user = auth?.user;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const router = useRouter();

  const newPasswordInputRef = useRef<TextInput>(null); // Ref for the new password input
  const confirmPasswordInputRef = useRef<TextInput>(null); // Ref for the confirm password input

  const handleUpdatePassword = () => {
    updatePassword(
      {
        id: String(user?.id),
        new_password: newPassword,
        old_password: oldPassword,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Success",
            `Your password has been updated successfully!`,
            [
              {
                text: "Confirm",
                onPress: () => {
                  router.dismiss();
                },
              },
            ],
            { cancelable: false } // This property ensures the alert cannot be dismissed by touching outside of it
          );
        },
      }
    );
  };

  const handleOldPasswordChange = (text: string) => {
    setOldPassword(text);
    const error = validateOldPassword(text); // Validate the old password
    setOldPasswordError(error); // Update error state for old password

    const newPasswordError = validateNewPassword(newPassword, text); // Validate the new password against the old password
    setNewPasswordError(newPasswordError); // Update new password error state
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    const error = validateNewPassword(text, oldPassword); // Validate the new password against the old password
    setNewPasswordError(error); // Update new password error state

    // Also check if confirm password matches the new password
    const confirmPasswordError = validateConfirmPassword(text, confirmPassword);
    setConfirmPasswordError(confirmPasswordError); // Update confirm password error state
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    const error = validateConfirmPassword(newPassword, text); // Validate confirm password against new password
    setConfirmPasswordError(error); // Update confirm password error state
  };

  const isFormComplete =
    oldPassword !== "" &&
    newPassword !== "" &&
    confirmPassword !== "" &&
    !oldPasswordError &&
    !newPasswordError &&
    !confirmPasswordError;

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
            value={oldPassword}
            placeholder="Old Password"
            onChangeText={handleOldPasswordChange}
            secureTextEntry={!showOldPassword}
            showPassword={showOldPassword}
            togglePasswordVisibility={() =>
              setShowOldPassword(!showOldPassword)
            }
            error={oldPasswordError}
            inputContainerStyle={styles.input}
            iconName="lock-closed"
          />
          <View style={styles.separator} />
          <Input
            ref={newPasswordInputRef}
            value={newPassword}
            placeholder="New Password"
            onChangeText={handleNewPasswordChange}
            secureTextEntry={!showNewPassword}
            showPassword={showNewPassword}
            togglePasswordVisibility={() =>
              setShowNewPassword(!showNewPassword)
            }
            error={newPasswordError}
            inputContainerStyle={styles.input}
            iconName="lock-closed"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()} // Focus on confirm password input
          />
          <View />
          <Input
            ref={confirmPasswordInputRef}
            value={confirmPassword}
            placeholder="Confirm Password"
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry={!showConfirmPassword}
            showPassword={showConfirmPassword}
            togglePasswordVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            error={confirmPasswordError}
            inputContainerStyle={styles.input}
            iconName="lock-closed"
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          isLoading={isPending}
          onPress={handleUpdatePassword}
          disabled={!isFormComplete || isPending} // Disable button if inputs are incomplete or pending
          buttonText="Change Password"
          style={styles.button}
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
  separator: {
    height: 1,
    backgroundColor: "#ccc", // Change color as needed
    marginBottom: 10, // Space above and below the separator
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
