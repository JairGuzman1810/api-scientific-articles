import { StyleSheet, View } from "react-native";

import { Text } from "@/src/components/Themed";

export default function MyArticlesScreen() {
  return (
    <View style={styles.container}>
      <Text>My articles</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
