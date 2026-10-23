import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";

import ThemeContext from "../context/ThemeContext";

import { useContext, useState } from "react";

import {
  Payment_Show,
  ClearPaymentHistory,
} from "../database/payment";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import SearchBar from "../components/SearchBox";
import CustomAlert, { ConfirmAlert } from "../components/CustomAlert";

export default function Payment() {
  const { theme } = useContext(ThemeContext);

  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [showAlert, setAlert] = useState(false);
  const [IshowAlert, IsetAlert] = useState(false);

  const filteredPayments = payments.filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useFocusEffect(
    useCallback(() => {
      getPayments();
    }, [])
  );

  const getPayments = async () => {
    const data = await Payment_Show();
    setPayments(data);
  };

  const handleClearHistory = () => {
    if (payments.length === 0) {
      IsetAlert(true);
      return;
    }

    setAlert(true);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            Payment History
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.secondaryText },
            ]}
          >
            Track all your payments
          </Text>
        </View>

        <Pressable
          onPress={handleClearHistory}
          style={[
            styles.clearButton,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.clearText,
              { color: theme.danger },
            ]}
          >
            Clear
          </Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Payment List */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) =>
          String(item.PAYMENT_ID)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredPayments.length === 0
            ? styles.emptyList
            : styles.list
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {/* Left Side */}
            <View style={styles.leftContent}>
              <Text
                numberOfLines={1}
                style={[
                  styles.orderName,
                  { color: theme.text },
                ]}
              >
                {item.ORDER_NAME}
              </Text>

              <Text
                style={[
                  styles.orderId,
                  { color: theme.secondaryText },
                ]}
              >
                Order #{item.ORDER_ID}
              </Text>

              <Text
                style={[
                  styles.date,
                  { color: theme.secondaryText },
                ]}
              >
                {item.PAYMENT_DATE}
              </Text>
            </View>

            {/* Right Side */}
            <View
              style={[
                styles.amountBox,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.amountLabel,
                  { color: theme.secondaryText },
                ]}
              >
                Payment
              </Text>

              <Text
                style={[
                  styles.amount,
                  { color: theme.primary },
                ]}
              >
                Rs. {item.PAYMENT_AMOUNT}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text },
              ]}
            >
              No Payments Found
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: theme.secondaryText },
              ]}
            >
              Payment history will appear here.
            </Text>
          </View>
        }
      />

      {/* No History Alert */}
      <ConfirmAlert
        visible={IshowAlert}
        title="Payment History"
        Message="There is no Payment History"
        onConfirm={() => {
          IsetAlert(false);
        }}
      />

      {/* Clear History Alert */}
      <CustomAlert
        visible={showAlert}
        title="Clear Payment History"
        Message="Are you sure you want to permanently delete payment history?"
        onCancel={() => {
          setAlert(false);
        }}
        onConfirm={async () => {
          await ClearPaymentHistory();
          setPayments([]);
          setAlert(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  clearButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },

  clearText: {
    fontSize: 12,
    fontWeight: "700",
  },

  searchContainer: {
    marginBottom: 14,
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftContent: {
    flex: 1,
    paddingRight: 12,
  },

  orderName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  orderId: {
    fontSize: 12,
  },

  date: {
    fontSize: 11,
    marginTop: 5,
  },

  amountBox: {
    minWidth: 105,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },

  amountLabel: {
    fontSize: 10,
    marginBottom: 3,
  },

  amount: {
    fontSize: 15,
    fontWeight: "700",
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingBottom: 80,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  emptyText: {
    fontSize: 12,
    marginTop: 6,
  },
});