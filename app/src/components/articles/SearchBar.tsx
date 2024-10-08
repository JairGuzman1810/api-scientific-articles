import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Dropdown from "./Dropdown";

interface SearchBarProps {
  onSearch: (search: string, filter: string) => void; // Define props interface
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const dropdownData = [
    { value: "title", label: "Title" },
    { value: "doi", label: "DOI" },
    { value: "keywords", label: "Keywords" },
  ];

  return (
    <View>
      <View style={styles.inputContainer}>
        <Input
          value={search}
          placeholder="Search"
          onChangeText={(text) => setSearch(text)}
          inputContainerStyle={styles.input}
          iconName="search"
        />

        <Dropdown
          data={dropdownData}
          onChange={(value) => setFilter(value)}
          style={styles.dropdown}
        />

        <Button
          onPress={() => onSearch(search, filter!)} // Call the onSearch function
          iconName="search"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
  },
  dropdown: {
    width: 100,
    paddingLeft: 5,
    paddingVertical: 12.5,
  },
  button: {
    paddingVertical: 11.5,
    paddingHorizontal: 10,
    backgroundColor: "#57BBBF",
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
    justifyContent: "center",
  },
});

export default SearchBar;
