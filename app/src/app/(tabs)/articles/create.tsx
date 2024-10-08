import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import {
  validateAbstract,
  validateAuthors,
  validateDoi,
  validateJournal,
  validateKeywords,
  validatePublicationDate,
  validateTitle,
} from "@/src/helpers/articleUtils";
import { useCreateArticle } from "@/src/hooks/useArticles";
import useAuth from "@/src/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function CreateArticleScreen() {
  const { auth } = useAuth();
  const user = auth?.user;
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [keywords, setKeywords] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");
  const [numberOfPages, setNumberOfPages] = useState("");
  const [abstract, setAbstract] = useState("");

  const [titleError, setTitleError] = useState<string | null>(null);
  const [authorsError, setAuthorsError] = useState<string | null>(null);
  const [keywordsError, setKeywordsError] = useState<string | null>(null);
  const [publicationDateError, setPublicationDateError] = useState<
    string | null
  >(null);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [doiError, setDoiError] = useState<string | null>(null);
  const [abstractError, setAbstractError] = useState<string | null>(null);

  const { mutate: createArticle, isPending } = useCreateArticle();
  const router = useRouter();

  const authorsInputRef = useRef<TextInput>(null);
  const keywordsInputRef = useRef<TextInput>(null);
  const publicationDateInputRef = useRef<TextInput>(null);
  const journalInputRef = useRef<TextInput>(null);
  const doiInputRef = useRef<TextInput>(null);
  const numberOfPagesInputRef = useRef<TextInput>(null);
  const abstractInputRef = useRef<TextInput>(null);

  const handleCreateArticle = () => {
    // Convert numberOfPages to a number or set it to null if it's an empty string
    const pages = numberOfPages ? Number(numberOfPages) : null;

    // Call the createArticle mutation with the gathered values
    createArticle(
      {
        title,
        authors,
        publication_date: publicationDate,
        keywords,
        abstract,
        journal,
        doi,
        pages,
        user_id: user?.id!, // Example user ID, replace with actual value
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Success",
            "Article created successfully.",
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
          isLoading={isPending}
          onPress={handleCreateArticle}
          disabled={!isFormComplete || isPending}
          buttonText="Create Article"
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
});
