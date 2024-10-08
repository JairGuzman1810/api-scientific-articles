import { Text } from "@/src/components/Themed";
import Button from "@/src/components/ui/Button";
import useAuth from "@/src/hooks/useAuth";
import { useDeleteUser } from "@/src/hooks/useUsers";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function DeleteAccountScreen() {
  const { auth, handleLogout } = useAuth();
  const user = auth?.user;
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Account",
          onPress: () =>
            deleteUser({ id: String(user?.id) }, { onSuccess: onDelete }),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const onDelete = () => {
    Alert.alert(
      "Account Deleted",
      "We're sorry to see you go. Thank you for being part of our community.",
      [
        {
          text: "OK",
          onPress: () => {
            handleLogout();
            router.replace("/(auth)"); // Navigate to the authentication screen
          },
        },
      ],
      { cancelable: false } // This prevents the alert from being dismissible
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            Are you sure you want to delete your account?
          </Text>

          <Text style={styles.description}>
            Deleting your account is a{" "}
            <Text style={styles.boldText}>permanent</Text> action. Once your
            account is deleted, you will{" "}
            <Text style={styles.boldText}>lose access</Text> to all your data,
            including your profile, saved articles, and any other information
            associated with your account.{"\n\n"}
            This process <Text style={styles.boldText}>cannot be undone</Text>,
            and you will not be able to recover your account or the data it
            contained. If you are absolutely certain you want to proceed, please
            press the button below to confirm this action.{" "}
            <Text style={styles.boldText}>
              Make sure this is the right decision
            </Text>{" "}
            before proceeding.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          isLoading={isPending}
          onPress={handleDelete}
          disabled={isPending} // Disable button if inputs are incomplete or pending
          buttonText="Delete account"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 15,
    paddingHorizontal: 5,
    fontFamily: "Poppins",
  },
  boldText: {
    fontFamily: "Poppins-Semibold",
  },
  bottomContainer: {
    padding: 10,
  },
  button: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FF4C4C",
    borderRadius: 50,
    marginTop: 10, // Ensure space between inputs and button
  },
});
