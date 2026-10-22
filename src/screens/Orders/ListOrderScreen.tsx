

import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useCallback, useState } from "react";

import FloatingButton from "../../components/FloatingButton";
import { useEffect } from "react";
import {useNavigation} from "@react-navigation/native"



import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as OrderFunctions from "../../database/order";

// import  theme from "../../constents/theme"
import ThemeContext from "../../context/ThemeContext";
import { useContext } from "react";
import CustomAlert from "../../components/CustomAlert";

export default function OrderList() {

  
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

    const [showAlert,SetShowAlert]=useState(false);
    const [deletedID,setDeletedid]=useState<null|number>(null);
const navigation = useNavigation<any>();
  const status = [
    "All",
    "Pending",
    "In Progress",
    "Ready",
    "Delivered",
  ];

  useFocusEffect(
    useCallback(() => {
      loadOrder();
    }, [])
  );

  async function loadOrder() {
    try {
      const data = await OrderFunctions.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.log("Failed to load orders:", error);
    }
  }

  function selectedStatus() {
    if (selectedFilter === "All") {
      return orders;
    }

    return orders.filter(
      (item) => item.ORDER_STAUS === selectedFilter
    );
  }

  const filteredOrders = selectedStatus();

  function getFilterCount(filter: string) {
    if (filter === "All") {
      return orders.length;
    }

    return orders.filter(
      (item) => item.ORDER_STAUS === filter
    ).length;
  }

  function handleDelete(orderId: number) {
 SetShowAlert(true)
 setDeletedid(orderId);

  }
  const ConfirmDelete=async()=>{
    if(deletedID!==null){
      try{
        await OrderFunctions.deleteOrder(deletedID);

      setOrders((prev) =>
        prev.filter((item) => item.ORDER_ID !== deletedID)
      );
SetShowAlert(false);
setDeletedid(null)
      }
        catch(error){
          console.log("Failed to delete Order...")
        }
    }
  }


  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            Orders
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.secondaryText },
            ]}
          >
            Manage your customer orders
          </Text>
        </View>

        <View
          style={[
            styles.totalBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.totalNumber,
              { color: theme.text },
            ]}
          >
            {orders.length}
          </Text>

          <Text
            style={[
              styles.totalText,
              { color: theme.secondaryText },
            ]}
          >
            Total
          </Text>
        </View>
      </View>

      {/* FILTER TITLE */}

      <Text
        style={[
          styles.filterTitle,
          { color: theme.text },
        ]}
      >
        Order Status
      </Text>

      {/* FILTER BUTTONS */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {status.map((item) => (
          <Pressable
            key={item}
            onPress={() => setSelectedFilter(item)}
            style={[
              styles.filterButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.text },
              ]}
            >
              {item}
            </Text>

            <Text
              style={[
                styles.countText,
                { color: theme.primary },
              ]}
            >
              {getFilterCount(item)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ORDERS LIST */}

      <FlatList
       style={{ flex: 1 }}
        data={filteredOrders}
        keyExtractor={(item) =>
          item.ORDER_ID.toString()
        }
      
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                shadowColor: theme.text,
              },
            ]}
           onPress={() => {
  navigation.navigate("DetailOrder", {
    orderId: item.ORDER_ID,
  });
}}
          >
            {/* CARD HEADER */}

            <View style={styles.cardHeader}>
              <View style={styles.nameContainer}>
                <Text
                  style={[
                    styles.orderName,
                    { color: theme.text },
                  ]}
                >
                  {item.ORDER_NAME || "Unnamed Order"}
                </Text>

                <Text
                  style={[
                    styles.orderId,
                    { color: theme.secondaryText },
                  ]}
                >
                  Order #{item.ORDER_ID}
                </Text>
              </View>

              {/* DELETE */}

              <Pressable
                style={[
                  styles.deleteButton,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={(event) => {
                  event.stopPropagation();
                  handleDelete(item.ORDER_ID);
                }}
              >
                <Ionicons
                  name="trash-outline"
                  size={19}
                  color={theme.danger}
                />
              </Pressable>
            </View>

            {/* STATUS + PRIORITY */}

            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: theme.primary,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    { color: theme.primary },
                  ]}
                >
                  {item.ORDER_STAUS}
                </Text>
              </View>

              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor:
                      theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="flag-outline"
                  size={13}
                  color={theme.warning}
                />

                <Text
                  style={[
                    styles.priorityText,
                    { color: theme.warning },
                  ]}
                >
                  {item.ORDER_PIRIORITY} Priority
                </Text>
              </View>
            </View>

            {/* ORDER INFORMATION */}

            <View
              style={[
                styles.infoContainer,
                { borderTopColor: theme.border },
              ]}
            >
              <View style={styles.infoItem}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.secondaryText },
                  ]}
                >
                  Quantity
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text },
                  ]}
                >
                  {item.QUANTITY}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.secondaryText },
                  ]}
                >
                  Total
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text },
                  ]}
                >
                  Rs. {item.ORDER_PAYMENT}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.secondaryText },
                  ]}
                >
                  Remaining
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text },
                  ]}
                >
                  Rs. {item.ORDER_REMAINING}
                </Text>
              </View>
            </View>

            {/* DEPARTURE DATE */}

            <View
              style={[
                styles.departureContainer,
                { borderTopColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.departureIcon,
                  {
                    backgroundColor:
                      theme.inputBackground,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={theme.primary}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.dateLabel,
                    { color: theme.secondaryText },
                  ]}
                >
                  Departure Date
                </Text>

                <Text
                  style={[
                    styles.dateValue,
                    { color: theme.text },
                  ]}
                >
                  {item.ORDER_DEPARTURE_DATE}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    theme.inputBackground,
                },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={52}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text },
              ]}
            >
              No Orders Found
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: theme.secondaryText },
              ]}
            >
              Try another status.
            </Text>
          </View>
        }
      />

<CustomAlert
visible={showAlert}
title="Delete Order"
Message="Are you sure you want to delete Order?"
onCancel={()=>{SetShowAlert(false)}}
onConfirm={ConfirmDelete}
/>
      {/* ADD ORDER */}

      <FloatingButton
  onPress={() => navigation.navigate('AddOrder')}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },

  totalBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
  },

  totalNumber: {
    fontSize: 20,
    fontWeight: "700",
  },

  totalText: {
    fontSize: 10,
    marginTop: 1,
  },

  filterTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

filterScroll: {
  flexGrow: 0,
},

filterContainer: {
  paddingBottom: 20,
  paddingRight: 10,
},

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },

  countText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },

  list: {
    paddingTop: 5,
    paddingBottom: 30,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nameContainer: {
    flex: 1,
    paddingRight: 10,
  },

  orderName: {
    fontSize: 18,
    fontWeight: "700",
  },

  orderId: {
    fontSize: 11,
    marginTop: 3,
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  badgesRow: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  marginTop: 14,
  gap: 6,
  flexWrap: "wrap",
},

statusBadge: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 8,
  paddingVertical: 6,
  borderRadius: 20,
  borderWidth: 1,
  flexShrink: 0,
},

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 0,
  },

  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },

  priorityText: {
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 0,
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  departureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
  },

  departureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  dateLabel: {
    fontSize: 10,
  },

  dateValue: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 65,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },

  emptyText: {
    fontSize: 12,
    marginTop: 5,
  },
});