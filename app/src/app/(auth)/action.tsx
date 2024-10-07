import LoginForm from "@/src/components/auth/LoginForm";
import RegisterForm from "@/src/components/auth/RegisterForm";
import TabSwitcher from "@/src/components/auth/TabSwitcher";
import { Text } from "@/src/components/Themed";
import React, { useRef, useState } from "react";
import { Image, PanResponder, StyleSheet, View } from "react-native";

export default function ActionScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx > 50) {
          setIsLogin(true);
        } else if (gestureState.dx < -50) {
          setIsLogin(false);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Welcome</Text>
        </View>
        <Image
          style={styles.image}
          source={require("../../assets/images/logo.png")}
        />
      </View>
      <TabSwitcher isLogin={isLogin} setIsLogin={setIsLogin} />
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontFamily: "Poppins-Bold",
    marginLeft: 15,
  },
  image: {
    width: "30%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
