import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Dropdown from "./Dropdown";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | undefined>("");

  const dropdownData = [
    { value: "title", label: "Title" },
    { value: "doi", label: "DOI" },
    { value: "keywords", label: "Keywords" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          value={search}
          placeholder="Search"
          onChangeText={(search) => setSearch(search)} // Use the new handler for real-time validation
          inputContainerStyle={styles.input}
          iconName="search"
          onSubmitEditing={() => {}} // Focus on password input
        />

        {/* Dropdown between Input and Button */}
        <Dropdown
          data={dropdownData}
          onChange={(value) => setFilter(value)}
          style={styles.dropdown} // Optional style for the dropdown
        />

        <Button
          onPress={() => {}}
          iconName="search"
          style={styles.button} // Optional style for the button
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1, // Input takes up remaining space
    marginRight: 10, // Tiny space between the input and the button
    paddingVertical: 10,
  },
  dropdown: {
    width: 100, // Adjust width as needed
    paddingLeft: 5,
    paddingVertical: 12.5,
  },
  button: {
    paddingVertical: 11.5,
    paddingHorizontal: 10,
    backgroundColor: "#57BBBF",
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10, // Tiny space between the input and the button
    justifyContent: "center",
  },
});
