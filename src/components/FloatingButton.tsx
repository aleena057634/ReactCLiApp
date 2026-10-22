
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Pressable, StyleSheet } from "react-native";

type FloatingButtonProps = {
  onPress: () => void;
};

export default function FloatingButton({
  onPress,
}: FloatingButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <Ionicons
        name="add"
        size={30}
        color="#2B2B2B"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#C6A15B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 999,
  },
});
