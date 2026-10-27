
import ThemeContext from "../../context/ThemeContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  CustomButton,
  ConfirmAlert,
} from "../../components/CustomAlert";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  AddCustomer,
  updateCunstomer,
} from "../../database/CustomerCru";

type CustomerParams = {
  ID?: string | number;
  NAME?: string;
  PHONE?: string;
  ADDRESS?: string;
};

export default function AddCustomers() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation<any>();
  const route = useRoute();

  const params = (route.params ?? {}) as CustomerParams;
  const { ID, NAME, PHONE, ADDRESS } = params;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loader, setLoader] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [AlertAll, setAlertALL] = useState(false);

  useEffect(() => {
    if (ID) {
      setName(NAME?.toString() || "");
      setPhone(PHONE?.toString() || "");
      setAddress(ADDRESS?.toString() || "");
    }
  }, [ID, NAME, PHONE, ADDRESS]);

  // Convert different Pakistani phone formats to one format.
  function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, "");

    if (digits.startsWith("0092")) {
      return digits.slice(2);
    }

    if (digits.startsWith("92")) {
      return digits;
    }

    if (digits.startsWith("03")) {
      return `92${digits.slice(1)}`;
    }

    return digits;
  }

  function showError(title: string, message: string) {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  }

  function validateName(value: string) {
    const CName = value.trim();

    if (!CName) {
      setNameError("Name can't be empty");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(CName)) {
      setNameError("Name can contain letters only");
      return false;
    }

    setNameError("");
    return true;
  }

  function validatePhone(value: string) {
    const CPhone = value.trim();

    if (!CPhone) {
      setPhoneError("Phone can't be empty");
      return false;
    }

    const phonePattern = /^(03\d{9}|\+923\d{9}|00923\d{9}|923\d{9})$/;

    if (!phonePattern.test(CPhone)) {
      setPhoneError(
        "Enter a valid number, e.g. 03001234567 or +923001234567"
      );
      return false;
    }

    setPhoneError("");
    return true;
  }

  function validateAddress(value: string) {
    const CAddress = value.trim();

    if (!CAddress) {
      setAddressError("Address can't be empty");
      return false;
    }

    setAddressError("");
    return true;
  }

  function handleValidation() {
    if (!name.trim() && !phone.trim() && !address.trim()) {
      setAlertALL(true);
      return false;
    }

    const validName = validateName(name);
    const validPhone = validatePhone(phone);
    const validAddress = validateAddress(address);

    return validName && validPhone && validAddress;
  }

  async function handleSave() {
    if (!handleValidation()) {
      return;
    }

    const normalizedPhone = normalizePhone(phone.trim());

    try {
      setLoader(true);

      if (ID) {
        await updateCunstomer(
          Number(ID),
          name.trim(),
          normalizedPhone,
          address.trim()
        );
      } else {
        await AddCustomer(
          name.trim(),
          normalizedPhone,
          address.trim()
        );
      }

      navigation.replace("CustomerList");
    } catch (error: any) {
      console.log("Customer save failed:", error);

      const message = String(error?.message || error);

      if (
        message.includes("UNIQUE constraint failed") ||
        message.includes("Customer_Table.PHONE") ||
        message.toLowerCase().includes("unique")
      ) {
        showError(
          "Duplicate Number",
          "This phone number already exists."
        );
      } else {
        showError(
          "Error",
          "Unable to save customer. Please try again."
        );
      }
    } finally {
      setLoader(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.keyboardView,
        { backgroundColor: theme.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          {/* HEADER */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.primary },
              ]}
            >
              <Ionicons
                name={ID ? "create-outline" : "person-add-outline"}
                size={28}
                color={theme.white}
              />
            </View>

            <Text style={[styles.title, { color: theme.text }]}>
              {ID ? "Update Customer" : "Add Customer"}
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.secondaryText },
              ]}
            >
              {ID
                ? "Update customer details"
                : "Enter customer details"}
            </Text>
          </View>

          {/* NAME */}
          <Text style={[styles.label, { color: theme.text }]}>
            Name
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.primary}
            />

            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter customer name"
              placeholderTextColor={theme.placeholder}
              value={name}
              onChangeText={(value) => {
                setName(value);
                setNameError("");
              }}
              onBlur={() => validateName(name)}
            />
          </View>

          {nameError ? (
            <Text style={styles.errorText}>{nameError}</Text>
          ) : null}

          {/* PHONE */}
          <Text style={[styles.label, { color: theme.text }]}>
            Phone
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="call-outline"
              size={20}
              color={theme.primary}
            />

            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="03001234567 or +923001234567"
              placeholderTextColor={theme.placeholder}
              value={phone}
              onChangeText={(value) => {
                setPhone(value);
                setPhoneError("");
              }}
              onBlur={() => validatePhone(phone)}
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>

          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          {/* ADDRESS */}
          <Text style={[styles.label, { color: theme.text }]}>
            Address
          </Text>

          <View
            style={[
              styles.addressContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={theme.primary}
            />

            <TextInput
              style={[
                styles.addressInput,
                { color: theme.text },
              ]}
              placeholder="Enter customer address"
              placeholderTextColor={theme.placeholder}
              value={address}
              onChangeText={(value) => {
                setAddress(value);
                setAddressError("");
              }}
              onBlur={() => validateAddress(address)}
              multiline
            />
          </View>

          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}

          {/* BUTTON */}
          {loader ? (
            <ActivityIndicator
              size="large"
              color={theme.primary}
              style={styles.loader}
            />
          ) : (
            <View style={styles.buttonContainer}>
              <CustomButton
                title={ID ? "Update" : "Add"}
                onPress={handleSave}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* ERROR ALERT */}
      <ConfirmAlert
        visible={showAlert}
        title={alertTitle}
        Message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />

      {/* REQUIRED FIELDS ALERT */}
      <ConfirmAlert
        visible={AlertAll}
        title="Required"
        Message="All fields required"
        onConfirm={() => setAlertALL(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    paddingBottom: 50,
  },

  form: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 5,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },

  addressContainer: {
    minHeight: 100,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  addressInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    minHeight: 75,
    textAlignVertical: "top",
  },

  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginBottom: 14,
    marginLeft: 4,
  },

  loader: {
    marginTop: 20,
  },

  buttonContainer: {
    marginTop: 20,
  },
});
