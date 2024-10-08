import Colors from "@/src/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../Themed";

type OptionItem = {
  value: string;
  label: string;
};

type DropDownProps = {
  data: OptionItem[];
  defaultValue?: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
};

type DropdownHandle = {
  triggerDropdown: () => void;
};

const Dropdown = React.forwardRef<DropdownHandle, DropDownProps>(
  ({ data, onChange, defaultValue, style }, ref) => {
    const colorScheme = useColorScheme();
    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState<string>("");
    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      isAbove: false,
    });

    const buttonRef = useRef<View>(null);

    useEffect(() => {
      if (defaultValue) {
        const selectedItem = data.find((item) => item.value === defaultValue);
        if (selectedItem) {
          setValue(selectedItem.label);
        } else {
          const firstItem = data[0];
          if (firstItem) {
            setValue(firstItem.label);
            onChange(firstItem.value);
          }
        }
      }
    }, [defaultValue, data]);

    const toggleExpanded = useCallback(() => {
      if (buttonRef.current) {
        buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
          const screenHeight = Dimensions.get("window").height;
          const spaceBelow = screenHeight - (pageY + height);
          const dropdownHeight = Math.min(250, data.length * 15);

          setDropdownPosition({
            top: 125,
            isAbove: spaceBelow < dropdownHeight,
          });

          setExpanded((prev) => !prev);
        });
      }
    }, [data.length]);

    const onSelect = useCallback(
      (item: OptionItem | null) => {
        if (item) {
          setValue(item.label);
          onChange(item.value);
        } else {
          setValue(""); // Clear the value
          onChange(""); // Reset the filter
        }
        setExpanded(false);
      },
      [onChange]
    );

    useImperativeHandle(ref, () => ({
      triggerDropdown: () => {
        setExpanded(true);
      },
    }));

    return (
      <View ref={buttonRef} style={[styles.inputContainer, style]}>
        <AntDesign color={"#000"} name={expanded ? "caretup" : "caretdown"} />
        <TouchableOpacity style={styles.button} onPress={toggleExpanded}>
          <Text style={[styles.text, !value && { color: "#808080" }]}>
            {value || "Filter"}
          </Text>
        </TouchableOpacity>
        {expanded && (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View style={styles.backdrop}>
                <View
                  style={[
                    styles.options,
                    {
                      top: dropdownPosition.top,
                      bottom: dropdownPosition.isAbove ? 0 : undefined,
                      backgroundColor:
                        Colors[colorScheme ?? "light"].cardBackground,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      borderRadius: 6,
                    },
                  ]}
                >
                  <FlatList
                    keyExtractor={(item) => item.value}
                    data={[{ value: "", label: "Clear Filter" }, ...data]} // Add "Clear Filter" option
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.optionItem}
                        onPress={() => onSelect(item.value ? item : null)}
                      >
                        <Text style={styles.textDropDown}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    );
  }
);

Dropdown.displayName = "Dropdown";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionItem: {
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  options: {
    position: "absolute",
    width: "90%",
    padding: 10,
    maxHeight: 250,
  },
  text: {
    fontFamily: "Poppins",
    flex: 1,
    fontSize: 13.5,
  },
  button: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingLeft: 5,
  },
  inputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    position: "relative",
  },
  textDropDown: {
    fontFamily: "Poppins",
  },
});

export default Dropdown;
