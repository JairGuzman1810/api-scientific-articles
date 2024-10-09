import { Text } from "@/src/components/Themed";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import {
  formatPublicationDate,
  validateAbstract,
  validateAuthors,
  validateDoi,
  validateJournal,
  validateKeywords,
  validatePublicationDate,
  validateTitle,
} from "@/src/helpers/articleUtils";
import {
  useArticleById,
  useDeleteArticle,
  useUpdateArticle,
} from "@/src/hooks/useArticles";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function EditArticleScreen() {
  const { article_id }: { article_id: string } = useLocalSearchParams();
  const { data: article, isLoading, error } = useArticleById(article_id);
  const { mutate: updateArticle, isPending } = useUpdateArticle();
  const { mutate: deleteArticle, isPending: isPendingDelete } =
    useDeleteArticle();
  const router = useRouter();

  // State initialization
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [keywords, setKeywords] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");
  const [numberOfPages, setNumberOfPages] = useState("");
  const [abstract, setAbstract] = useState("");

  // Error states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [authorsError, setAuthorsError] = useState<string | null>(null);
  const [keywordsError, setKeywordsError] = useState<string | null>(null);
  const [publicationDateError, setPublicationDateError] = useState<
    string | null
  >(null);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [doiError, setDoiError] = useState<string | null>(null);
  const [abstractError, setAbstractError] = useState<string | null>(null);

  // Input refs
  const authorsInputRef = useRef<TextInput>(null);
  const keywordsInputRef = useRef<TextInput>(null);
  const publicationDateInputRef = useRef<TextInput>(null);
  const journalInputRef = useRef<TextInput>(null);
  const doiInputRef = useRef<TextInput>(null);
  const numberOfPagesInputRef = useRef<TextInput>(null);
  const abstractInputRef = useRef<TextInput>(null);

  // Effect to set state when article data is loaded
  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setAuthors(
        (article.authors ? JSON.parse(article.authors) : []).join(", ") || ""
      );
      setKeywords(
        (article.keywords ? JSON.parse(article.keywords) : []).join(", ") || ""
      );
      setPublicationDate(formatPublicationDate(article?.publication_date!));
      setJournal(article.journal || "");
      setDoi(article.doi || "");
      setNumberOfPages(String(article.pages || ""));
      setAbstract(article.abstract || "");
    }
  }, [article]); // Dependency array includes article

  const handleUpdateArticle = () => {
    updateArticle(
      {
        title,
        authors,
        publication_date: publicationDate,
        keywords,
        abstract,
        journal,
        pages: Number(numberOfPages),
        article_id: Number(article_id),
        doi,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Success",
            "Article updated successfully.",
            [
              {
                text: "Confirm",
                onPress: () => {
                  router.dismiss();
                },
              },
            ],
            { cancelable: false } // This property ensures the alert cannot be dismissed by touching outside of it
          );
        },
      }
    );
  };

  const handleDeleteArticle = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this article? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Article",
          onPress: () => deleteArticle({ article_id }, { onSuccess: onDelete }),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const onDelete = () => {
    router.dismiss();

    Alert.alert(
      "Article Deleted",
      "The article has been removed successfully.",
      [
        {
          text: "OK",
        },
      ],
      { cancelable: false } // Prevents the alert from being dismissible
    );
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setTitleError(validateTitle(text));
  };

  const handleAuthorsChange = (text: string) => {
    setAuthors(text);
    setAuthorsError(validateAuthors(text));
  };

  const handleKeywordsChange = (text: string) => {
    setKeywords(text);
    setKeywordsError(validateKeywords(text));
  };

  const handlePublicationDateChange = (text: string) => {
    setPublicationDate(text);
    setPublicationDateError(validatePublicationDate(text));
  };

  const handleJournalChange = (text: string) => {
    setJournal(text);
    setJournalError(validateJournal(text));
  };

  const handleDoiChange = (text: string) => {
    setDoi(text);
    setDoiError(validateDoi(text));
  };

  const handleAbstractChange = (text: string) => {
    setAbstract(text);
    setAbstractError(validateAbstract(text));
  };

  const isFormComplete =
    title !== "" &&
    authors !== "" &&
    keywords !== "" &&
    publicationDate !== "" &&
    journal !== "" &&
    doi !== "" &&
    abstract !== "" &&
    !titleError &&
    !authorsError &&
    !keywordsError &&
    !publicationDateError &&
    !journalError &&
    !doiError &&
    !abstractError;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57BBBF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          {error.message || "An error occurred."}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 500 })}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Input
            value={title}
            placeholder="Title"
            onChangeText={handleTitleChange}
            error={titleError}
            inputContainerStyle={styles.input}
            iconName="book"
            onSubmitEditing={() => authorsInputRef.current?.focus()}
            inputMode="text"
          />
          <Input
            ref={authorsInputRef}
            value={authors}
            placeholder="Authors (comma-separated)"
            onChangeText={handleAuthorsChange}
            error={authorsError}
            inputContainerStyle={styles.input}
            iconName="people"
            onSubmitEditing={() => keywordsInputRef.current?.focus()}
            inputMode="text"
          />
          <Input
            ref={keywordsInputRef}
            value={keywords}
            placeholder="Keywords (comma-separated)"
            onChangeText={handleKeywordsChange}
            error={keywordsError}
            inputContainerStyle={styles.input}
            iconName="key"
            onSubmitEditing={() => publicationDateInputRef.current?.focus()}
            inputMode="text"
          />
          <Input
            ref={publicationDateInputRef}
            value={publicationDate}
            placeholder="Publication Date (YYYY-MM-DD)"
            onChangeText={handlePublicationDateChange}
            error={publicationDateError}
            inputContainerStyle={styles.input}
            iconName="calendar"
            onSubmitEditing={() => journalInputRef.current?.focus()}
            inputMode="text"
          />
          <Input
            ref={journalInputRef}
            value={journal}
            placeholder="Journal"
            onChangeText={handleJournalChange}
            error={journalError}
            inputContainerStyle={styles.input}
            iconName="newspaper"
            onSubmitEditing={() => doiInputRef.current?.focus()}
            inputMode="text"
          />
          <Input
            ref={doiInputRef}
            value={doi}
            placeholder="DOI"
            onChangeText={handleDoiChange}
            error={doiError}
            inputContainerStyle={styles.input}
            iconName="document"
            onSubmitEditing={() => numberOfPagesInputRef.current?.focus()}
            inputMode="text"
          />
          <Input
            ref={numberOfPagesInputRef}
            value={numberOfPages}
            placeholder="Number of Pages (optional)"
            onChangeText={setNumberOfPages}
            inputContainerStyle={styles.input}
            iconName="document"
            onSubmitEditing={() => abstractInputRef.current?.focus()}
            inputMode="numeric"
            returnKeyType="done"
          />
          <Input
            ref={abstractInputRef}
            value={abstract}
            placeholder="Abstract (max. 700 words)"
            onChangeText={handleAbstractChange}
            error={abstractError}
            inputContainerStyle={[styles.input, { height: 200, flex: 1 }]}
            iconName="text"
            inputMode="text"
            multiline
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          isLoading={isPending || isPendingDelete}
          onPress={handleUpdateArticle}
          disabled={!isFormComplete || isPending || isPendingDelete}
          buttonText="Update article"
          style={styles.button}
        />
      </View>
      <Button
        isLoading={isPending || isPendingDelete}
        iconName="trash"
        iconSize={30}
        iconColor="#FFF"
        onPress={handleDeleteArticle}
        disabled={isPending || isPendingDelete}
        style={styles.floatingButton}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: "space-between",
    padding: 10,
  },
  inputContainer: {
    flexGrow: 1,
  },
  input: {
    marginBottom: 10,
    paddingVertical: 18,
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#57BBBF",
    borderRadius: 50,
    marginTop: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20, // Positioned in bottom left
    backgroundColor: "#FF4C4C",
    width: 60,
    height: 60,
    borderRadius: 30, // Rounded button
    justifyContent: "center",
    alignItems: "center",
  },
});
