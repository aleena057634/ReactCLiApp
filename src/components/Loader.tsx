
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useContext } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import ThemeContext from "../context/ThemeContext";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  value,
  onChangeText,
}: SearchBarProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.border,
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={21}
        color={theme.secondaryText}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
          },
        ]}
        placeholder="Search by Name..."
        placeholderTextColor={theme.placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 2,
  },

  input: {
    flex: 1,
    marginLeft: 11,
    fontSize: 15,
    paddingVertical: 0,
  },
});