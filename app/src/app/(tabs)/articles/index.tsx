import ArticleList from "@/src/components/articles/ArticleList";
import Button from "@/src/components/ui/Button";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function MyArticlesScreen() {
  const router = useRouter();

  const handleAddArticle = () => {
    // Handle the button press action (e.g., navigate to add article screen)
    router.navigate("/articles/create");
  };

  return (
    <View style={styles.container}>
      <ArticleList />
      <Button
        iconName="add" // Ionicons plus icon
        iconSize={30} // Adjust icon size if needed
        iconColor="#FFF"
        onPress={handleAddArticle}
        style={styles.floatingButton} // Apply the custom floating button style
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20, // Positioned in bottom left
    backgroundColor: "#57BBBF", // Blue color
    width: 60,
    height: 60,
    borderRadius: 30, // Rounded button
    justifyContent: "center",
    alignItems: "center",
  },
});
