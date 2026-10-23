import { Ionicons } from "@react-native-vector-icons/ionicons";
import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import {
  getCustomerName,
  getTotalCustomers,
  Measurement_table,
} from "../src/database/table";
import { TotalOrders, getUrgentOrders } from "../src/database/order";
import ThemeContext from "../src/context/ThemeContext";

import {
  ProfileImage,
  saveProfileImage,
  getProfileImage,
} from "../src/database/ImageCrud";

import { ProfileImageModal } from "../src/components/CustomAlert";
import * as ImagePicker from "react-native-image-picker";
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Screen } from "react-native-screens";

export default function Dashboard() {
  const { theme } = useContext(ThemeContext);

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [Name, setName] = useState("");
  const [TotalOrder, setTotalOrder] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [ImageAlert, showImageAlert] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) {
          return;
        }

        const imageUri = response.assets?.[0]?.uri;

        if (imageUri) {
          setProfileImage(imageUri);
          await saveProfileImage(imageUri);
        }
      },
    );
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) {
          return;
        }

        const imageUri = response.assets?.[0]?.uri;

        if (imageUri) {
          setProfileImage(imageUri);
          await saveProfileImage(imageUri);
        }
      },
    );
  };

  const UrgentOrder = async () => {
    try {
      const data = await getUrgentOrders();
      setOrders(data);
    } catch (error) {
      console.log("Failed to load urgent orders:", error);
    }
  };

  const loadCustomers = async () => {
    const count = await getTotalCustomers();
    setTotalCustomers(count);
  };

  const loadOrders = async () => {
    const count = await TotalOrders();
    setTotalOrder(count);
  };

  useFocusEffect(
    useCallback(() => {
      UrgentOrder();
      loadCustomers();
      loadOrders();
    }, [])
  );

  useEffect(() => {
    Measurement_table();
    ProfileImage();

    const LoadName = async () => {
      const username = await getCustomerName();
      setName(username || "");
    };

    const LoadProfileImage = async () => {
      const image = await getProfileImage();
      setProfileImage(image);
    };

    LoadProfileImage();
    loadCustomers();
    loadOrders();
    LoadName();
  }, []);

  return (
    <SafeAreaView
      edges={[]}
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.userSection}>
            <View
              style={[
                styles.userIcon,
                {
                  backgroundColor: theme.card,
                  borderWidth: 1,
                  borderColor: theme.primary,
                },
              ]}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={21}
                  color={theme.primary}
                />
              )}

              <View
                style={[
                  styles.cameraIcon,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Pressable
                  onPress={() => {
                    showImageAlert(true);
                  }}
                >
                  <Ionicons
                    name="camera-outline"
                    size={13}
                    color={theme.primary}
                  />
                </Pressable>
              </View>
            </View>

            <View style={{ marginStart: 10 }}>
              <Text
                style={{
                  fontStyle: "italic",
                  color: theme.text,
                }}
              >
                Welcome back,
              </Text>

              <Text
                style={{
                  fontFamily: "serif",
                  color: theme.text,
                }}
              >
                {Name || "Tailor"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.settingsButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation.navigate("Setting", {
              screen: "Setting"
            })}
          >
            <Ionicons
              name="settings-outline"
              size={21}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        {/* FLOW OF ORDERS */}

        <View
          style={[
            styles.flowCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.flowHeader}>
            <View>
              <Text
                style={[
                  styles.flowTitle,
                  { color: theme.text },
                ]}
              >
                Flow of Orders
              </Text>

              <Text
                style={[
                  styles.flowSubtitle,
                  { color: theme.secondaryText },
                ]}
              >
                Your orders overview
              </Text>
            </View>

            <View
              style={[
                styles.orderCountBox,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.orderCount,
                  { color: theme.white },
                ]}
              >
                {TotalOrder}
              </Text>

              <Text
                style={[
                  styles.orderCountText,
                  { color: theme.white },
                ]}
              >
                ORDERS
              </Text>
            </View>
          </View>

          <View style={styles.flow}>
            <View
              style={[
                styles.flowLine,
                { backgroundColor: theme.border },
              ]}
            />

            <View style={styles.flowItem}>
              <View
                style={[
                  styles.flowCircle,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={theme.white}
                />
              </View>

              <Text
                style={[
                  styles.flowText,
                  { color: theme.text },
                ]}
              >
                Pending
              </Text>
            </View>

            <View style={styles.flowItem}>
              <View
                style={[
                  styles.flowCircle,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Ionicons
                  name="construct-outline"
                  size={17}
                  color={theme.white}
                />
              </View>

              <Text
                style={[
                  styles.flowText,
                  { color: theme.text },
                ]}
              >
                In Progress
              </Text>
            </View>

            <View style={styles.flowItem}>
              <View
                style={[
                  styles.flowCircle,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Ionicons
                  name="checkmark-outline"
                  size={17}
                  color={theme.white}
                />
              </View>

              <Text
                style={[
                  styles.flowText,
                  { color: theme.text },
                ]}
              >
                Ready
              </Text>
            </View>

            <View style={styles.flowItem}>
              <View
                style={[
                  styles.flowCircle,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Ionicons
                  name="bag-check-outline"
                  size={17}
                  color={theme.white}
                />
              </View>

              <Text
                style={[
                  styles.flowText,
                  { color: theme.text },
                ]}
              >
                Delivered
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.viewOrdersButton,
              {
                borderColor: theme.border,
                backgroundColor: theme.background,
              },
            ]}
            onPress={() => navigation.navigate("Orders")}
          >
            <Text
              style={[
                styles.viewOrdersText,
                { color: theme.text },
              ]}
            >
              View all orders
            </Text>

            <Ionicons
              name="arrow-forward-outline"
              size={15}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        {/* QUICK ACTIONS */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text },
              ]}
            >
              Quick Actions
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Manage your tailor shop
            </Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          {/* ADD CUSTOMER */}

          <Pressable
            style={[
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation.navigate('Customers', {
              screen: "AddCustomer",
            })}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name="person-add-outline"
                size={20}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.actionTitle,
                { color: theme.text },
              ]}
            >
              Add Customer
            </Text>
          </Pressable>

          {/* ADD ORDER */}

          <Pressable
            style={[
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() =>
              navigation.navigate('Orders', {
                screen: 'AddOrder',
              })
            }
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.actionTitle,
                { color: theme.text },
              ]}
            >
              Add Order
            </Text>
          </Pressable>

          {/* PAYMENT */}

          <Pressable
            style={[
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => { navigation.navigate("Payment") }}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name="wallet-outline"
                size={20}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.actionTitle,
                { color: theme.text },
              ]}
            >
              Payment
            </Text>
          </Pressable>

          {/* CUSTOMERS */}

          <Pressable
            style={[
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation.navigate('Customers', {
              screen: "CustomerList"
            })}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={20}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.actionTitle,
                { color: theme.text },
              ]}
            >
              Customers
            </Text>

            <Text
              style={[
                styles.actionNumber,
                { color: theme.text },
              ]}
            >
              {totalCustomers}
            </Text>
          </Pressable>

          {/* ORDERS */}

          <Pressable
            style={[
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation.navigate("OrderStackNavigation",{
              screen:"AddOrder"
            })}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={20}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.actionTitle,
                { color: theme.text },
              ]}
            >
              Orders
            </Text>

            <Text
              style={[
                styles.actionNumber,
                { color: theme.text },
              ]}
            >
              {TotalOrder}
            </Text>
          </Pressable>

          {/* URGENT */}

          <Pressable
            style={[
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            // onPress={() => navigation.navigate("Orders", { screen: "ListOrderScreen" })}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={theme.warning}
              />
            </View>

            <Text
              style={[
                styles.actionTitle,
                { color: theme.text },
              ]}
            >
              Urgent
            </Text>

            <Text
              style={[
                styles.actionNumber,
                { color: theme.warning },
              ]}
            >
              {orders.length}
            </Text>
          </Pressable>
        </View>

        {/* URGENT ORDERS */}

        {orders.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.text },
                  ]}
                >
                  Urgent Orders
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: theme.secondaryText },
                  ]}
                >
                  Orders that need attention
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate
                  ("OrderStackNavigation", 
                    { screen: "ListOrderScreen" })}
              >
                <Text
                  style={[
                    styles.viewAll,
                    { color: theme.primary },
                  ]}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {orders.map((order) => (
              <Pressable
                key={order.ORDER_ID}
                style={[
                  styles.orderCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}

                
              onPress={()=>{
navigation.navigate("OrderStackNavigation",{
  Screen:"DetailOrderScreen",
 params: {
orderId: order.ORDER_ID.toString(),
  }
})

              }}

              >

                <View
                  style={[
                    styles.orderIcon,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons
                    name="alert-outline"
                    size={21}
                    color={theme.warning}
                  />
                </View>

                <View style={styles.orderInfo}>
                  <Text
                    style={[
                      styles.orderName,
                      { color: theme.text },
                    ]}
                  >
                    {order.NAME || "Customer"}
                  </Text>

                  <Text
                    style={[
                      styles.orderDetail,
                      { color: theme.secondaryText },
                    ]}
                  >
                    {order.ORDER_NAME || "Urgent Order"}
                  </Text>
                </View>

                <View
                  style={[
                    styles.urgentBadge,
                    { backgroundColor: theme.warning },
                  ]}
                >
                  <Text
                    style={[
                      styles.urgentText,
                      { color: theme.white },
                    ]}
                  >
                    URGENT
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={18}
                  color={theme.secondaryText}
                />
              </Pressable>
            ))}
          </>
        )}

        <ProfileImageModal
          visible={ImageAlert}
          onClose={() => {
            showImageAlert(false);
          }}
          onCamera={() => {
            showImageAlert(false);
            takePhoto();
          }}
          onGallery={() => {
            showImageAlert(false);
            pickImage();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  scrollContainer: {},

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 23,
  },

  cameraIcon: {
    position: "absolute",
    right: -5,
    bottom: -3,
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    marginStart: 20,
    fontSize: 20,
    fontWeight: "800",
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  flowCard: {
    borderRadius: 22,
    padding: 17,
    borderWidth: 1,
    elevation: 3,
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  flowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  flowTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  flowSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  orderCountBox: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },

  orderCount: {
    fontSize: 20,
    fontWeight: "800",
  },

  orderCountText: {
    fontSize: 8,
    marginTop: 1,
  },

  flow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    position: "relative",
  },

  flowLine: {
    position: "absolute",
    height: 2,
    left: 20,
    right: 20,
    top: 17,
  },

  flowItem: {
    alignItems: "center",
    width: "25%",
  },

  flowCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  flowText: {
    fontSize: 8,
    fontWeight: "600",
    marginTop: 7,
    textAlign: "center",
  },

  viewOrdersButton: {
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },

  viewOrdersText: {
    fontSize: 11,
    fontWeight: "700",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 25,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "31.5%",
    minHeight: 125,
    borderRadius: 17,
    padding: 12,
    marginBottom: 11,
    borderWidth: 1,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  actionTitle: {
    fontSize: 11,
    fontWeight: "700",
  },

  actionNumber: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },

  viewAll: {
    fontSize: 11,
    fontWeight: "700",
  },

  orderCard: {
    minHeight: 68,
    borderRadius: 17,
    padding: 12,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  orderInfo: {
    flex: 1,
    marginLeft: 11,
  },

  orderName: {
    fontSize: 13,
    fontWeight: "700",
  },

  orderDetail: {
    fontSize: 10,
    marginTop: 4,
  },

  urgentBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    marginRight: 8,
  },

  urgentText: {
    fontSize: 9,
    fontWeight: "700",
  },
});