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
import { useArticleById } from "@/src/hooks/useArticles";
import useAuth from "@/src/hooks/useAuth";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function EditArticleScreen() {
  const { article_id }: { article_id: string } = useLocalSearchParams();

  const { auth } = useAuth();
  const user = auth?.user;
  const { data: article, isLoading, error } = useArticleById(article_id);

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
      setPublicationDate(
        formatPublicationDate(article?.publication_date!) // Use the utility function here
      );
      setJournal(article.journal || "");
      setDoi(article.doi || "");
      setNumberOfPages(String(article.pages || ""));
      setAbstract(article.abstract || "");
    }
  }, [article]); // Dependency array includes article

  const handleCreateArticle = () => {
    // Logic to handle article creation
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
            inputMode="text"
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
          isLoading={isLoading}
          onPress={handleCreateArticle}
          disabled={!isFormComplete || isLoading}
          buttonText="Update article"
          style={styles.button}
        />
      </View>
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
});
