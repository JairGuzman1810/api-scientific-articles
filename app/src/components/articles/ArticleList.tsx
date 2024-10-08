import { Article } from "@/src/helpers/type";
import { useArticlesByUserId } from "@/src/hooks/useArticles";
import useAuth from "@/src/hooks/useAuth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "../Themed";
import ArticleListItem from "./ArticleListItem";
import SearchBar from "./SearchBar";

const ArticleList = () => {
  const { auth } = useAuth();
  const user = auth?.user;
  const [searching, setSearching] = useState("");
  const {
    data: articles,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useArticlesByUserId(String(user?.id));

  // State for filtered articles, typed as Article[]
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(
    articles || []
  );

  // Method to handle search and filter
  const handleSearch = (search: string, filter: string) => {
    const lowerCaseSearch = search.toLowerCase();
    setSearching(search);
    // Only proceed if the search string is not empty
    if (search) {
      const filtered = articles?.filter((article) => {
        if (filter) {
          // If a specific filter is provided, match based on the filter
          switch (filter) {
            case "title":
              return article.title.toLowerCase().includes(lowerCaseSearch);
            case "doi":
              return article.doi.toLowerCase().includes(lowerCaseSearch);
            case "keywords":
              const keywordsArray = JSON.parse(article.keywords);
              return keywordsArray.some((keyword: string) =>
                keyword.toLowerCase().includes(lowerCaseSearch)
              );
            default:
              return false; // If an unrecognized filter is provided
          }
        } else {
          // If no filter is provided, search across all fields
          const titleMatch = article.title
            .toLowerCase()
            .includes(lowerCaseSearch);
          const doiMatch = article.doi.toLowerCase().includes(lowerCaseSearch);
          const keywordsArray = JSON.parse(article.keywords);
          const keywordMatch = keywordsArray.some((keyword: string) =>
            keyword.toLowerCase().includes(lowerCaseSearch)
          );

          return titleMatch || doiMatch || keywordMatch;
        }
      });

      // Set filtered articles to the result or an empty array if no matches
      setFilteredArticles(filtered && filtered.length > 0 ? filtered : []);
    } else {
      // If the search string is empty, set filtered articles to all articles
      setFilteredArticles(articles || []);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      {isLoading || isRefetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#57BBBF" />
        </View>
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {error.message || "An error occurred."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={
            filteredArticles.length > 0
              ? filteredArticles
              : searching // Check if there is a search term
              ? [] // If there's a search term but no matches, show empty
              : articles // If no search term, show all articles
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ArticleListItem article={item} />}
          ListEmptyComponent={
            <View style={styles.messageContainer}>
              <Text style={styles.message}>No articles found</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching} // Show the activity indicator while refetching
              onRefresh={refetch} // Call the refetch function when the user pulls to refresh
            />
          }
        />
      )}
    </View>
  );
};

export default ArticleList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    fontFamily: "Poppins-Semibold",
    color: "#8D94A2",
    textAlign: "center",
    paddingHorizontal: 15,
    flex: 1,
  },
});
