
import CustomAlert, {
  ConfirmAlert,
  ProfileImageModal,
} from "../../components/CustomAlert";
import DateModel from "../../components/DateModel";
import ThemeContext from "../../context/ThemeContext";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import * as ImagePicker from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

import { getCustomers } from "../../database/CustomerCru";
import { addOrderImage } from "../../database/ImageCrud";
import { getMeasurements } from "../../database/MeasuremenrCruc";
import { addOrder } from "../../database/order";
 
// import { showOrderNotification, showPaymentNotification } from '../../utils/notification';
import { Payment_Value } from "../../database/payment";
export default function OrderScreen() {

  
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
const [audios, setAudios] = useState<string[]>([]);
  const [orderName, setOrderName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loader, setLoader] = useState(false);

  const [customers, setCustomers] = useState<any[]>([]);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const [measurements, setMeasurements] = useState<any[]>([]);
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<any>(null);

  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(new Date());

  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");

  const [totalPayment, setTotalPayment] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");

  const [customerAlert, setCustomerAlert] = useState(false);
  const [measurementAlert, setMeasurementAlert] = useState(false);
  const [alertQuantity, setAlertQuantity] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertPriority, setAlertPriority] = useState(false);
  const [alertAdvance, setAlertAdvance] = useState(false);
  const [alertTotalAmount, setAlertTotalAmount] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [orderImages, setOrderImages] = useState<string[]>([]);
  const [ImageAlert, setImageAlert] = useState(false);
  const [deleteImage, setdeleteImage] = useState(false);
  const [imageLimitAlert, setImageLimitAlert] = useState(false);
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(
    null
  );
const navigation = useNavigation<any>();
  
const pickImage = () => {
  if (orderImages.length >= 2) {
    setImageLimitAlert(true);
    return;
  }

  ImagePicker.launchImageLibrary(
    {
      mediaType: "photo",
      selectionLimit: 1,
      quality: 1,
    },
    (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.log("Gallery error:", response.errorMessage);
        return;
      }

      const imageUri = response.assets?.[0]?.uri;

      if (imageUri) {
        setOrderImages((prev) => [...prev, imageUri]);
        setImageAlert(false);
      }
    }
  );
};

const takePhoto = () => {
  if (orderImages.length >= 2) {
    setImageLimitAlert(true);
    return;
  }

  ImagePicker.launchCamera(
    {
      mediaType: "photo",
      quality: 1,
      cameraType: "back",
      saveToPhotos: true,
    },
    (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.log("Camera error:", response.errorMessage);
        return;
      }

      const imageUri = response.assets?.[0]?.uri;

      if (imageUri) {
        setOrderImages((prev) => [...prev, imageUri]);
        setImageAlert(false);
      }
    }
  );
};


  const statuses = [
    "Pending",
    "In Progress",
  ];

  const priorities = [
    "Low",
    "Normal",
    "High",
    "Urgent",
  ];

  const remainingPayment =
    (Number(totalPayment) || 0) -
    (Number(advancePayment) || 0);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.log("Failed to load customers:", error);
    }
  }

  async function loadMeasurements(customerId: number) {
    try {
      const data = await getMeasurements(customerId);
      setMeasurements(data);
    } catch (error) {
      console.log(
        "Failed to load customer measurements:",
        error
      );
    }
  }

  function handleCustomerSelect(customer: any) {
    setSelectedCustomer(customer);
    setCustomerOpen(false);

    setSelectedMeasurement(null);

    loadMeasurements(Number(customer.ID));
  }

  async function handleCreateOrder() {
    if (!selectedCustomer) {
      setCustomerAlert(true);
      return;
    }

    if (!selectedMeasurement) {
      setMeasurementAlert(true);
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setAlertQuantity(true);
      return;
    }

    if (!selectedStatus) {
      setAlertStatus(true);
      return;
    }

    if (!selectedPriority) {
      setAlertPriority(true);
      return;
    }

    if (!totalPayment || Number(totalPayment) < 0) {
      setAlertTotalAmount(true);
      return;
    }

    if (Number(advancePayment) > Number(totalPayment)) {
      setAlertAdvance(true);
      return;
    }

    try {
      setLoader(true);

    const result = await addOrder(
  Number(quantity),
  selectedStatus,
  selectedPriority,
  arrivalDate.toISOString().split("T")[0],
  departureDate.toISOString().split("T")[0],
  Number(totalPayment),
  Number(advancePayment) || 0,
  remainingPayment,
  Number(selectedCustomer.ID),
  Number(selectedMeasurement.mEASUREMENT_ID),
  notes
);
  const orderId = result;
// await showOrderNotification();

      for (const image of orderImages) {
        await addOrderImage(image, orderId);
      }
      
    if (Number(advancePayment) > 0) {
  const paymentDate = new Date().toISOString().split("T")[0];

  await Payment_Value(
    Number(orderId),
    Number(advancePayment),
    paymentDate
  );

  // await showPaymentNotification(
  //   Number(orderId),
  //   orderName,
  //   selectedCustomer.NAME,
  //   Number(advancePayment)
  // );
}


      ToastAndroid.show(
        "Order added successfully",
        ToastAndroid.SHORT
      );

      setLoader(false);

      navigation.replace("OrderList");

      setOrderName("");
      setQuantity("");
      setSelectedCustomer(null);
      setSelectedMeasurement(null);
      setMeasurements([]);
      setSelectedStatus("");
      setSelectedPriority("");
      setTotalPayment("");
      setAdvancePayment("");
      setNotes("");
      setOrderImages([]);

    } catch (error) {
      setLoader(false);

      console.log("Failed to create order:", error);

      setErrorAlert(true);
    }
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: theme.text },
          ]}
        >
          Create Order
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme.secondaryText },
          ]}
        >
          Enter order details
        </Text>
      </View>

      {/* CUSTOMER */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          Customer
        </Text>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Select Customer
        </Text>

        <Pressable
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => {
            setCustomerOpen(!customerOpen);

            setMeasurementOpen(false);
            setStatusOpen(false);
            setPriorityOpen(false);
          }}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={theme.primary}
          />

          <Text
            style={[
              styles.dropdownText,
              {
                color: selectedCustomer
                  ? theme.text
                  : theme.placeholder,
              },
            ]}
          >
            {selectedCustomer?.NAME ||
              "Select customer"}
          </Text>

          <Ionicons
            name={
              customerOpen
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color={theme.primary}
          />
        </Pressable>

        {customerOpen && (
          <View
            style={[
              styles.dropdownList,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {customers.length === 0 ? (
              <Text
                style={[
                  styles.noOption,
                  { color: theme.secondaryText },
                ]}
              >
                No customers found
              </Text>
            ) : (
              customers.map((customer) => (
                <Pressable
                  key={customer.ID}
                  style={[
                    styles.option,
                    { borderBottomColor: theme.border },
                  ]}
                  onPress={() =>
                    handleCustomerSelect(customer)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: theme.text },
                    ]}
                  >
                    {customer.NAME}
                  </Text>

                  {customer.PHONE && (
                    <Text
                      style={[
                        styles.optionSubText,
                        { color: theme.secondaryText },
                      ]}
                    >
                      {customer.PHONE}
                    </Text>
                  )}
                </Pressable>
              ))
            )}
          </View>
        )}
      </View>

      {/* ORDER DETAILS */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          Order Details
        </Text>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Order Name
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={theme.secondaryText}
          />

          <TextInput
            style={[
              styles.input,
              { color: theme.text },
            ]}
            placeholder="Enter order name"
            placeholderTextColor={theme.placeholder}
            value={orderName}
            onChangeText={setOrderName}
          />
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Quantity
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="layers-outline"
            size={20}
            color={theme.primary}
          />

          <TextInput
            style={[
              styles.input,
              { color: theme.text },
            ]}
            placeholder="Enter quantity"
            placeholderTextColor={theme.placeholder}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Arrival Date
        </Text>

        <DateModel
          date={arrivalDate}
          setDate={setArrivalDate}
           disabled={true}
        />

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Departure Date
        </Text>

        <DateModel
          date={departureDate}
          setDate={setDepartureDate}
        />

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Status
        </Text>

        <Pressable
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => {
            setStatusOpen(!statusOpen);

            setCustomerOpen(false);
            setMeasurementOpen(false);
            setPriorityOpen(false);
          }}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={theme.secondaryText}
          />

          <Text
            style={[
              styles.dropdownText,
              {
                color: selectedStatus
                  ? theme.text
                  : theme.placeholder,
              },
            ]}
          >
            {selectedStatus || "Select status"}
          </Text>

          <Ionicons
            name={
              statusOpen
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color={theme.primary}
          />
        </Pressable>

        {statusOpen && (
          <View
            style={[
              styles.dropdownList,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {statuses.map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.option,
                  { borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  setSelectedStatus(status);
                  setStatusOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.text },
                  ]}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Priority
        </Text>

        <Pressable
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => {
            setPriorityOpen(!priorityOpen);

            setCustomerOpen(false);
            setMeasurementOpen(false);
            setStatusOpen(false);
          }}
        >
          <Ionicons
            name="flag-outline"
            size={20}
            color={theme.secondaryText}
          />

          <Text
            style={[
              styles.dropdownText,
              {
                color: selectedPriority
                  ? theme.text
                  : theme.placeholder,
              },
            ]}
          >
            {selectedPriority || "Select priority"}
          </Text>

          <Ionicons
            name={
              priorityOpen
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color={theme.primary}
          />
        </Pressable>

        {priorityOpen && (
          <View
            style={[
              styles.dropdownList,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {priorities.map((priority) => (
              <Pressable
                key={priority}
                style={[
                  styles.option,
                  { borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  setSelectedPriority(priority);
                  setPriorityOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.text },
                  ]}
                >
                  {priority}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* MEASUREMENT */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          Measurement
        </Text>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Select Measurement
        </Text>

        <Pressable
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => {
            if (!selectedCustomer) {
              setCustomerAlert(true);
              return;
            }

            setMeasurementOpen(!measurementOpen);

            setCustomerOpen(false);
            setStatusOpen(false);
            setPriorityOpen(false);
          }}
        >
          <Ionicons
            name="body-outline"
            size={20}
            color={theme.secondaryText}
          />

          <Text
            style={[
              styles.dropdownText,
              {
                color: selectedMeasurement
                  ? theme.text
                  : theme.placeholder,
              },
            ]}
          >
            {selectedMeasurement?.TYPE ||
              "Select customer measurement"}
          </Text>

          <Ionicons
            name={
              measurementOpen
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color={theme.primary}
          />
        </Pressable>

        {measurementOpen && (
          <View
            style={[
              styles.dropdownList,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {measurements.length === 0 ? (
              <Text
                style={[
                  styles.noOption,
                  { color: theme.secondaryText },
                ]}
              >
                No measurements found for this customer
              </Text>
            ) : (
              measurements.map((item) => (
                <Pressable
                  key={item.mEASUREMENT_ID}
                  style={[
                    styles.option,
                    { borderBottomColor: theme.border },
                  ]}
                  onPress={() => {
                    setSelectedMeasurement(item);
                    setMeasurementOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: theme.text },
                    ]}
                  >
                    {item.TYPE}
                  </Text>

                  <Text
                    style={[
                      styles.optionSubText,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Measurement #{item.mEASUREMENT_ID}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        )}
      </View>

      <View>
        <></>
      </View>

      {/* PAYMENT */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          Payment Details
        </Text>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Total Payment
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="cash-outline"
            size={20}
            color={theme.secondaryText}
          />

          <TextInput
            style={[
              styles.input,
              { color: theme.text },
            ]}
            placeholder="Enter total payment"
            placeholderTextColor={theme.placeholder}
            keyboardType="numeric"
            value={totalPayment}
            onChangeText={setTotalPayment}
          />
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Advance Payment
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="wallet-outline"
            size={20}
            color={theme.secondaryText}
          />

          <TextInput
            style={[
              styles.input,
              { color: theme.text },
            ]}
            placeholder="Enter advance payment"
            placeholderTextColor={theme.placeholder}
            keyboardType="numeric"
            value={advancePayment}
            onChangeText={setAdvancePayment}
          />
        </View>

        <View
          style={[
            styles.remainingBox,
            { backgroundColor: theme.background },
          ]}
        >
          <Text
            style={[
              styles.remainingLabel,
              { color: theme.secondaryText },
            ]}
          >
            Remaining Payment
          </Text>

          <Text
            style={[
              styles.remainingAmount,
              { color: theme.text },
            ]}
          >
            Rs. {remainingPayment}
          </Text>
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Notes
        </Text>

        <TextInput
          style={[
            styles.notesInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Enter any additional notes"
          placeholderTextColor={theme.placeholder}
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* ADD DESIGN */}
  
{/* ADD DESIGN */}
<View
  style={[
    styles.card,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },
  ]}
>
  <View style={styles.designHeader}>
    <View>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.text },
        ]}
      >
        Add Design
      </Text>

      <Text
        style={[
          styles.designSubtitle,
          { color: theme.secondaryText },
        ]}
      >
        Add up to 2 design images
      </Text>
    </View>

    <View
      style={[
        styles.imageCount,
        { backgroundColor: theme.background },
      ]}
    >
      <Text
        style={[
          styles.imageCountText,
          { color: theme.primary },
        ]}
      >
        {orderImages.length}/2
      </Text>
    </View>
  </View>

  <Pressable
    style={[
      styles.addImageButton,
      {
        backgroundColor: theme.inputBackground,
        borderColor: theme.primary,
      },
    ]}
    onPress={() => {
      if (orderImages.length >= 2) {
        setImageLimitAlert(true);
        return;
      }

      setImageAlert(true);
    }}
  >
    <View
      style={[
        styles.imageIconCircle,
        { backgroundColor: theme.primary },
      ]}
    >
      <Ionicons
        name="image-outline"
        size={27}
        color={theme.white}
      />
    </View>

    <View style={styles.addImageContent}>
      <Text
        style={[
          styles.addImageText,
          { color: theme.text },
        ]}
      >
        Add Design Image
      </Text>

      <Text
        style={[
          styles.addImageHint,
          { color: theme.secondaryText },
        ]}
      >
        Choose from gallery or take a photo
      </Text>
    </View>

    <Ionicons
      name="chevron-forward"
      size={21}
      color={theme.primary}
    />
  </Pressable>

  {orderImages.length > 0 && (
    <View style={styles.imagesRow}>
      {orderImages.map((image, index) => (
        <View
          key={index}
          style={styles.imagePreviewBox}
        >
          <Image
            source={{ uri: image }}
            style={styles.orderImage}
          />

          <View
            style={[
              styles.imageNumber,
              { backgroundColor: theme.primary },
            ]}
          >
            <Text style={styles.imageNumberText}>
              {index + 1}
            </Text>
          </View>

          <Pressable
            style={[
              styles.deleteImageButton,
              {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={() => {
              setDeleteImageIndex(index);
              setdeleteImage(true);
            }}
          >
            <Ionicons
              name="close"
              size={20}
              color={theme.white}
            />
          </Pressable>
        </View>
      ))}
    </View>
  )}
</View>



      {/* CREATE ORDER */}
      {loader ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
        />
      ) : (
        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.primary },
          ]}
          onPress={handleCreateOrder}
        >
          <Text
            style={[
              styles.buttonText,
              { color: theme.white },
            ]}
          >
            Create Order
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color={theme.white}
          />
        </Pressable>
      )}

      {/* DELETE IMAGE ALERT */}
      <CustomAlert
        visible={deleteImage}
        onConfirm={() => {
          if (deleteImageIndex !== null) {
            setOrderImages((prev) =>
              prev.filter(
                (_, index) => index !== deleteImageIndex
              )
            );
          }

          setDeleteImageIndex(null);
          setdeleteImage(false);
        }}
        onCancel={() => {
          setdeleteImage(false);
          setDeleteImageIndex(null);
        }}
        title="Delete Image Order"
        Message="Are You sure you want to delete Order image?"
      />

      {/* IMAGE LIMIT ALERT */}
      <ConfirmAlert
        visible={imageLimitAlert}
        title="Image Limit Reached"
        Message="You can add maximum 2 images for one order."
        onConfirm={() => {
          setImageLimitAlert(false);
        }}
      />

      {/* CUSTOMER ALERT */}
      <ConfirmAlert
        visible={customerAlert}
        title="Customer Required"
        Message="Please select a customer first."
        onConfirm={() => {
          setCustomerAlert(false);
        }}
      />

      {/* MEASUREMENT ALERT */}
      <ConfirmAlert
        visible={measurementAlert}
        title="Measurement Required"
        Message="Please select a measurement first."
        onConfirm={() => {
          setMeasurementAlert(false);
        }}
      />

      {/* QUANTITY ALERT */}
      <ConfirmAlert
        visible={alertQuantity}
        title="Quantity Required"
        Message="Please enter a valid quantity."
        onConfirm={() => {
          setAlertQuantity(false);
        }}
      />

      {/* STATUS ALERT */}
      <ConfirmAlert
        visible={alertStatus}
        title="Status Required"
        Message="Please select the order status."
        onConfirm={() => {
          setAlertStatus(false);
        }}
      />

      {/* PRIORITY ALERT */}
      <ConfirmAlert
        visible={alertPriority}
        title="Priority Required"
        Message="Please select the order priority."
        onConfirm={() => {
          setAlertPriority(false);
        }}
      />

      {/* TOTAL PAYMENT ALERT */}
      <ConfirmAlert
        visible={alertTotalAmount}
        title="Payment Amount"
        Message="Please enter a valid total payment amount."
        onConfirm={() => {
          setAlertTotalAmount(false);
        }}
      />

      {/* ADVANCE PAYMENT ALERT */}
      <ConfirmAlert
        visible={alertAdvance}
        title="Invalid Advance"
        Message="Advance payment cannot be greater than total payment."
        onConfirm={() => {
          setAlertAdvance(false);
        }}
      />

      {/* ERROR ALERT */}
      <ConfirmAlert
        visible={errorAlert}
        title="Error"
        Message="Order could not be created."
        onConfirm={() => {
          setErrorAlert(false);
        }}
      />

      {/* ORDER IMAGE MODAL */}
      <ProfileImageModal
        visible={ImageAlert}
        onCamera={takePhoto}
        onGallery={pickImage}
        onClose={() => {
          setImageAlert(false);
        }}
      />
  

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 35,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 13.5,
    marginTop: 4,
    letterSpacing: 0.1,
  },

  // =========================
  // CARDS
  // =========================

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,

    elevation: 2,

    shadowOpacity: 0.07,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 13,
    letterSpacing: 0.1,
  },

  label: {
    fontSize: 13.5,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 9,
  },

  // =========================
  // INPUT
  // =========================

  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14.5,
  },

  // =========================
  // DROPDOWN
  // =========================

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,
  },

  dropdownText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14.5,
  },

  dropdownList: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 6,
    overflow: "hidden",
  },

  option: {
    padding: 13,
    borderBottomWidth: 1,
  },

  optionText: {
    fontSize: 14.5,
  },

  optionSubText: {
    fontSize: 12,
    marginTop: 3,
  },

  noOption: {
    padding: 15,
    fontSize: 14,
    textAlign: "center",
  },

  // =========================
  // PAYMENT
  // =========================

  remainingBox: {
    marginTop: 17,
    padding: 14,
    borderRadius: 12,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  remainingLabel: {
    fontSize: 13.5,
    fontWeight: "600",
  },

  remainingAmount: {
    fontSize: 17,
    fontWeight: "800",
  },

  notesInput: {
    minHeight: 100,

    borderWidth: 1,
    borderRadius: 12,

    padding: 13,

    fontSize: 14.5,
    textAlignVertical: "top",
  },

  // =========================
  // ADD DESIGN
  // =========================

  imageSection: {
    marginBottom: 14,
  },

  designHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 15,
  },

  designSubtitle: {
    fontSize: 12.5,
    marginTop: -8,
  },

  imageCount: {
    minWidth: 42,
    height: 30,

    paddingHorizontal: 9,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",
  },

  imageCountText: {
    fontSize: 13,
    fontWeight: "700",
  },

  addImageButton: {
    minHeight: 82,

    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,
  },

  imageIconCircle: {
    width: 52,
    height: 52,

    borderRadius: 26,

    justifyContent: "center",
    alignItems: "center",
  },

  addImageContent: {
    flex: 1,
    marginLeft: 12,
  },

  addImageText: {
    fontSize: 15,
    fontWeight: "700",
  },

  addImageHint: {
    fontSize: 11.5,
    marginTop: 4,
  },

  imagesRow: {
    flexDirection: "row",
    gap: 10,

    marginTop: 12,
  },

  imagePreviewBox: {
    flex: 1,
    height: 180,

    borderRadius: 12,

    overflow: "hidden",
    position: "relative",
  },

  orderImage: {
    width: "100%",
    height: "100%",

    resizeMode: "cover",

    borderRadius: 12,
  },

  imageNumber: {
    position: "absolute",

    left: 8,
    top: 8,

    minWidth: 26,
    height: 26,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  imageNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  deleteImageButton: {
    position: "absolute",

    top: 8,
    right: 8,

    width: 32,
    height: 32,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  // =========================
  // CREATE ORDER BUTTON
  // =========================

  button: {
    height: 52,

    borderRadius: 14,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 8,

    marginTop: 2,

    elevation: 3,

    shadowOpacity: 0.12,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  buttonText: {
    fontSize: 15.5,
    fontWeight: "700",
  },
});
