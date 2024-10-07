import { Text } from "@/src/components/Themed";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/logo.png")}
      />
      <Text style={styles.title}>Your Research, Organized and Accessible </Text>
      <Text style={styles.subtitle}>Version 1.0.0</Text>
      <View style={styles.bottomcontainer}>
        <Link href={"/action"} asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttontext}>Access the System</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {},
  title: {
    fontSize: 25,
    lineHeight: 32,
    textAlign: "center",
    fontFamily: "Nunito-Bold",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 10,
    color: "#C6C6C6",
    fontFamily: "Nunito-Semibold",
  },
  bottomcontainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 20,
    justifyContent: "flex-end",
    flex: 1,
  },
  button: {
    borderRadius: 50,
    backgroundColor: "#57BBBF",
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttontext: {
    color: "#FCFCFC",
    lineHeight: 20,
    fontFamily: "Poppins-Semibold",
  },
  forgotcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  forgot: {
    fontFamily: "Poppins",
    fontSize: 12,
  },
  forgotbold: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    marginLeft: 5,
  },
});
