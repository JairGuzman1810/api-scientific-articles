import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../Themed";

type ProfileUserProps = {
  name: string;
};

export default function ProfileUser({ name }: ProfileUserProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.userContainer}>
      <Ionicons
        name="person-circle"
        size={180}
        color={Colors[colorScheme ?? "light"].icon}
      />
      <Text style={styles.nameText}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
