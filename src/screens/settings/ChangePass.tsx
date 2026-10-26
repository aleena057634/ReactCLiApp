import ThemeContext from "../../context/ThemeContext";
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ChangePassword } from "../../database/table";
import CustomAlert, { ConfirmAlert } from "../../components/CustomAlert";

export default function ChangePass() {
  const { theme } = useContext(ThemeContext);
  const navigation=useNavigation<any>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passError, setPassError] = useState("");
  const [ConpassError, setconPassError] = useState("");

  const [loader, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [SuccessAlert, SetSuccessAlert] = useState(false);

  const PassValidtion = (passwod: string) => {
    const pass = passwod.trim();

    if (!pass) {
      setPassError("Password can't be empty");
      return false;
    }

    if (pass.length < 8) {
      setPassError("Password must be at least 8 characters");
      return false;
    }

    if (!/[a-z]/.test(pass)) {
      setPassError("Password must contain a lowercase letter");
      return false;
    }

    if (!/[A-Z]/.test(pass)) {
      setPassError("Password must contain an uppercase letter");
      return false;
    }

    if (!/[0-9]/.test(pass)) {
      setPassError("Password must contain a number");
      return false;
    }

    if (!/[@$!%*?&]/.test(pass)) {
      setPassError("Password must contain a special symbol");
      return false;
    }

    setPassError("");
    return true;
  };

  const ConfPassValidtion = (passwod: string) => {
    const pass = passwod.trim();

    if (!pass) {
      setconPassError("Confirm Password can't be empty");
      return false;
    }

    if (pass !== password) {
      setconPassError("Passwords do not match");
      return false;
    }

    setconPassError("");
    return true;
  };

  const handleValidation = async () => {
    const passwordValid = PassValidtion(password);

    if (!passwordValid) {
      return;
    }

    const confirmPasswordValid = ConfPassValidtion(confirmPassword);

    if (!confirmPasswordValid) {
      return;
    }

    try {
      setLoading(true);

      await ChangePassword(password);

      setLoading(false);
      SetSuccessAlert(true);
    } catch (error) {
      setLoading(false);
      SetSuccessAlert(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={30}
              color={theme.white}
            />
          </View>

          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            Change Password
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.secondaryText },
            ]}
          >
            Create a new secure password for your account
          </Text>
        </View>

        {/* FORM CARD */}
        <View
          style={[
            styles.box,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {/* PASSWORD */}
          <Text
            style={[
              styles.label,
              { color: theme.text },
            ]}
          >
            New Password
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: passError
                  ? theme.primary
                  : theme.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.secondaryText}
            />

            <TextInput
              placeholder="Enter new password"
              placeholderTextColor={theme.placeholder}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPassError("");
              }}
              onBlur={() => {
                PassValidtion(password);
              }}
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                { color: theme.text },
              ]}
            />

            <Pressable
              onPress={() =>
                setShowPassword(!showPassword)
              }
              style={styles.eyeButton}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={21}
                color={theme.primary}
              />
            </Pressable>
          </View>

          {passError !== "" && (
            <View style={styles.errorRow}>
              <Ionicons
                name="alert-circle-outline"
                size={14}
                color="#D32F2F"
              />

              <Text style={styles.errorText}>
                {passError}
              </Text>
            </View>
          )}

          {/* CONFIRM PASSWORD */}
          <Text
            style={[
              styles.label,
              { color: theme.text },
            ]}
          >
            Confirm Password
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: ConpassError
                  ? theme.primary
                  : theme.border,
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.secondaryText}
            />

            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor={theme.placeholder}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setconPassError("");
              }}
              onBlur={() => {
                ConfPassValidtion(confirmPassword);
              }}
              secureTextEntry={!showConfirmPassword}
              style={[
                styles.input,
                { color: theme.text },
              ]}
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              style={styles.eyeButton}
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={21}
                color={theme.primary}
              />
            </Pressable>
          </View>

          {ConpassError !== "" && (
            <View style={styles.errorRow}>
              <Ionicons
                name="alert-circle-outline"
                size={14}
                color="#D32F2F"
              />

              <Text style={styles.errorText}>
                {ConpassError}
              </Text>
            </View>
          )}

          {/* PASSWORD HINT */}
          <View
            style={[
              styles.hintBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={theme.primary}
            />

            <Text
              style={[
                styles.hintText,
                { color: theme.secondaryText },
              ]}
            >
              Use at least 8 characters with uppercase,
              lowercase, number and special symbol.
            </Text>
          </View>

          {/* SAVE BUTTON */}
          <Pressable
            onPress={handleValidation}
            disabled={loader}
            style={[
              styles.saveButton,
              { backgroundColor: theme.primary },
            ]}
          >
            {loader ? (
              <ActivityIndicator
                size="small"
                color={theme.white}
              />
            ) : (
              <>
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: theme.white },
                  ]}
                >
                  Save Password
                </Text>

                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color={theme.white}
                />
              </>
            )}
          </Pressable>
        </View>

        {/* SECURITY TEXT */}
        <View style={styles.securityRow}>
          {/* <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color={theme.primary}
          /> */}

          <Text
            style={[
              styles.securityText,
              { color: theme.secondaryText },
            ]}
          >
            Your password is securely updated
          </Text>
        </View>

        {/* SUCCESS ALERT */}
        <ConfirmAlert
          visible={SuccessAlert}
          title="Success"
          Message="Password Updated Successfully"
          onConfirm={() => {
            SetSuccessAlert(false);
            navigation.goback();
          }}
        />
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 30,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13.5,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 20,
    paddingHorizontal: 25,
  },

  // =========================
  // CARD
  // =========================

  box: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",

    padding: 19,
    borderRadius: 18,
    borderWidth: 1,

    elevation: 3,

    shadowOpacity: 0.08,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  // =========================
  // LABEL
  // =========================

  label: {
    fontSize: 13.5,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 5,
  },

  // =========================
  // INPUT
  // =========================

  inputContainer: {
    width: "100%",
    minHeight: 52,

    borderWidth: 1,
    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,
  },

  input: {
    flex: 1,

    fontSize: 14.5,

    marginLeft: 10,
    paddingVertical: 0,

    paddingRight: 8,
  },

  eyeButton: {
    width: 36,
    height: 45,

    justifyContent: "center",
    alignItems: "center",
  },

  // =========================
  // ERROR
  // =========================

  errorRow: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    marginTop: 6,
    marginBottom: 5,
  },

  errorText: {
    color: "#D32F2F",
    fontSize: 12,

    marginLeft: 5,
    flex: 1,
  },

  // =========================
  // HINT
  // =========================

  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",

    borderWidth: 1,
    borderRadius: 12,

    padding: 12,

    marginTop: 18,
    marginBottom: 18,
  },

  hintText: {
    flex: 1,

    fontSize: 12,
    lineHeight: 18,

    marginLeft: 8,
  },

  // =========================
  // BUTTON
  // =========================

  saveButton: {
    width: "100%",
    minHeight: 53,

    borderRadius: 13,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 8,

    elevation: 3,

    shadowOpacity: 0.12,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  saveButtonText: {
    fontSize: 15.5,
    fontWeight: "700",
  },

  // =========================
  // FOOTER
  // =========================

  securityRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 18,
  },

  securityText: {
    fontSize: 12,

    marginLeft: 6,
  },
});