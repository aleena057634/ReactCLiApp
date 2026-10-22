import colors from "../constents/colors";
import { StyleSheet, Text, View } from "react-native";

type Customer = {
  ID: number;
  NAME: string;
  PHONE: string;
  ADDRESS: string;
};

export default function CustomerItemStyle({ item }: { item: Customer }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>
          {item.NAME?.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.name}>{item.NAME}</Text>

        <Text style={styles.phone}>{item.PHONE}</Text>

        <Text style={styles.address}>{item.ADDRESS}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },

  customerInfo: {
    flex: 1,
  },

  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  phone: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 5,
  },

  address: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 3,
  },
});