import React from "react";
import { StyleSheet, View } from "react-native";
import TabButton from "./TabButton";

type TabSwitcherProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TabSwitcher({ isLogin, setIsLogin }: TabSwitcherProps) {
  return (
    <View style={styles.buttonContainer}>
      <TabButton
        title="Login"
        isActive={isLogin}
        onPress={() => setIsLogin(true)}
      />
      <TabButton
        title="Register"
        isActive={!isLogin}
        onPress={() => setIsLogin(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
});
