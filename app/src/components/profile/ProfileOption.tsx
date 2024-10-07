import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../Themed";

type ProfileOptionProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

export default function ProfileOption({
  iconName,
  title,
  onPress,
}: ProfileOptionProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color="#fff" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 45,
  },
  iconContainer: {
    backgroundColor: "#57BBBF",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: "Lato-Semibold",
  },
});
