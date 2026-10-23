
import React, {
  useCallback,
  useContext,
  useState,
} from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import FloatingButton from "../../components/FloatingButton";
import SearchBox from "../../components/SearchBox";
import CustomAlert from "../../components/CustomAlert";
import ThemeContext from "../../context/ThemeContext";
import {
  DeleteCustomer,
  getCustomers,
} from "../../database/CustomerCru";

type Customer = {
  ID: number;
  NAME: string;
  PHONE: string;
  ADDRESS: string;
};

export default function CustomerList() {
  const navigation = useNavigation<any>();
  const { theme } = useContext(ThemeContext);

  const [search, setSearch] = useState("");
  const [CustomersData, setCustomerData] = useState<Customer[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [showEditAlert, setEditAlert] = useState(false);

  const filteredCustomers = CustomersData.filter((item) =>
    item.NAME.toLowerCase().includes(search.toLowerCase())
  );

  async function LoadCustomer() {
    try {
      const data = await getCustomers();
      setCustomerData(data);
    } catch (error) {
      console.log("Failed to load customers:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      LoadCustomer();
      setSearch("");
    }, [])
  );

  async function HandleDeletedCustomer(id: number) {
    try {
      await DeleteCustomer(id);
      await LoadCustomer();
    } catch (error) {
      console.log("Error deleting customer:", error);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Customers Heading */}
      <Text
        style={[
          styles.heading,
          { color: theme.text },
        ]}
      >
        Customers
      </Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBox
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.ID.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredCustomers.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={48}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text },
              ]}
            >
              No Customers Found
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: theme.secondaryText },
              ]}
            >
              Add a customer to get started.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              navigation.navigate("CustomerDetail", {
                id: item.ID.toString(),
              });
            }}
          >
            {/* Customer Avatar */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.iconText,
                  { color: theme.white },
                ]}
              >
                {item.NAME?.charAt(0).toUpperCase()}
              </Text>
            </View>

            {/* Customer Info */}
            <View style={styles.customerInfo}>
              <Text
                numberOfLines={1}
                style={[
                  styles.name,
                  { color: theme.text },
                ]}
              >
                {item.NAME}
              </Text>

              <View style={styles.infoRow}>
                <Ionicons
                  name="call-outline"
                  size={14}
                  color={theme.primary}
                />

                <Text
                  style={[
                    styles.infoText,
                    { color: theme.secondaryText },
                  ]}
                >
                  {item.PHONE}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={theme.primary}
                />

                <Text
                  numberOfLines={1}
                  style={[
                    styles.infoText,
                    { color: theme.secondaryText },
                  ]}
                >
                  {item.ADDRESS}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {/* Delete Button */}
              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.background },
                ]}
                onPress={() => {
                  setDeleteId(item.ID);
                  setShowAlert(true);
                }}
              >
                <Ionicons
                  name="trash-outline"
                  color={theme.primary}
                  size={18}
                />
              </Pressable>

              {/* Edit Button */}
              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.background },
                ]}
                onPress={() => {
                  setEditId(item.ID);
                  setEditAlert(true);
                }}
              >
                <Ionicons
                  name="create-outline"
                  color={theme.primary}
                  size={18}
                />
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      {/* Delete Confirmation */}
      <CustomAlert
        visible={showAlert}
        title="Delete Customer"
        Message="Are you sure you want to delete customer permanently?"
        onCancel={() => {
          setShowAlert(false);
          setDeleteId(null);
        }}
        onConfirm={async () => {
          if (deleteId !== null) {
            await HandleDeletedCustomer(deleteId);
          }

          setShowAlert(false);
          setDeleteId(null);
        }}
      />

      {/* Edit Confirmation */}
      <CustomAlert
        visible={showEditAlert}
        title="Edit Customer Information"
        Message="Are you sure you want to edit information?"
        onCancel={() => {
          setEditAlert(false);
          setEditId(null);
        }}
        onConfirm={() => {
          const customer = CustomersData.find(
            (item) => item.ID === editId
          );

          if (customer) {
            navigation.navigate("AddCustomer", {
              ID: customer.ID.toString(),
              NAME: customer.NAME,
              PHONE: customer.PHONE,
              ADDRESS: customer.ADDRESS,
            });
          }

          setEditAlert(false);
          setEditId(null);
        }}
      />

      {/* Add Customer */}
      <FloatingButton
        onPress={() => {
          navigation.navigate("AddCustomer");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 14,
    marginBottom: 8,
  },

  searchContainer: {
    marginHorizontal: 14,
    marginBottom: 8,
  },

  listContainer: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 100,
  },

  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 70,
  },

  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
  },

  card: {
    minHeight: 82,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 21,
    fontWeight: "800",
  },

  customerInfo: {
    flex: 1,
    paddingRight: 8,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  infoText: {
    fontSize: 12.5,
    marginLeft: 5,
    flex: 1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
});
