import Colors from "@/src/constants/Colors";
import { Article } from "@/src/helpers/type";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "../Themed";

type ArticleListItemProps = {
  article: Article;
};

export default function ArticleListItem({ article }: ArticleListItemProps) {
  const colorScheme = useColorScheme(); // Use useColorScheme for dynamic color change
  const authors = JSON.parse(article.authors); // Parsing the authors array
  const keywords = JSON.parse(article.keywords); // Parsing keywords array

  return (
    <View
      style={[
        styles.articleContainer,
        { backgroundColor: Colors[colorScheme ?? "light"].cardBackground }, // Dynamic background
      ]}
    >
      <View style={styles.articleDetails}>
        {/* Title */}
        <Text numberOfLines={1} style={styles.articleTitle}>
          {article.title}
        </Text>

        {/* Published by */}
        <Text style={[styles.publishedText, styles.marginTop]}>
          Published by{" "}
          <Text style={styles.articleInfo}>{authors.join(", ")}</Text> in{" "}
          <Text style={styles.articleInfo}>{article.journal}</Text>
        </Text>

        {/* Keywords */}
        <View style={[styles.keywordContainer, styles.marginTop]}>
          {keywords.map((keyword: string, index: number) => (
            <View key={index} style={styles.keywordTag}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  articleContainer: {
    borderRadius: 10,
    margin: 6,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "column", // Layout vertically
    // No fixed or minimum height so it adapts to content
  },
  articleDetails: {
    flex: 1,
    paddingHorizontal: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
  publishedText: {
    color: "gray", // Gray color for the word "Published"
    fontSize: 14,
  },
  articleInfo: {
    fontSize: 14,
    fontFamily: "Lato-Semibold", // Lato-Semibold for Authors and Journal
    color: "#1C9FE2", // Blue color for Authors and Journal
    lineHeight: 16,
  },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    justifyContent: "center", // Center keywords if they are many
  },
  keywordTag: {
    backgroundColor: "#1C9FE2", // Blue background
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  keywordText: {
    color: "#FFFFFF", // White text
    fontFamily: "Lato-Bold",
    fontSize: 12,
  },
  marginTop: {
    marginTop: 8,
  },
});
