import Colors from "@/src/constants/Colors";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Text } from "../Themed";

type TabButtonProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
};

export default function TabButton({
  title,
  isActive,
  onPress,
}: TabButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.buttonaction,
          {
            borderBottomWidth: isActive ? 1 : 0,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonactiontext,
            {
              opacity: isActive ? 1 : 0.6,
              color: isActive ? "#57BBBF" : Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonaction: {
    padding: 10,
    paddingHorizontal: 30,
    borderBottomColor: "#57BBBF",
  },
  buttonactiontext: {
    fontFamily: "Poppins-Semibold",
    fontSize: 16,
  },
});
