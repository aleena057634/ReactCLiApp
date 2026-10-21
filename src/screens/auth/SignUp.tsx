
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@react-native-vector-icons/ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { adduser, checkEmail } from "../../database/queries";
import { userTable } from "../../database/table";

export default function SignUp() {
  const navigation = useNavigation<any>();

  const [Username, setName] = useState("");
  const [UserEmail, setEmail] = useState("");
  const [UserPas, setPas] = useState("");
  const [ConfirmPas, setConfirmPas] = useState("");
  const [UserPhone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");

  useEffect(() => {
    userTable().catch(error => {
      console.log("User table initialization failed:", error);
    });
  }, []);

  // NAME VALIDATION
  function validName(name: string) {
    if (!name.trim()) {
      setNameError("Name can't be empty");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      setNameError("Name contains letters only");
      return false;
    }

    setNameError("");
    return true;
  }

  // EMAIL VALIDATION
  function validEmail(email: string) {
    if (!email.trim()) {
      setEmailError("Email can't be empty");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.com$/i.test(email.trim())) {
      setEmailError("Enter a valid email ending in .com");
      return false;
    }

    setEmailError("");
    return true;
  }

  // PASSWORD VALIDATION
  function validPass(pass: string) {
    if (!pass) {
      setPassError("Password can't be empty");
      return false;
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    if (!passwordPattern.test(pass)) {
      setPassError(
        "Use at least 8 characters, a number and a special character"
      );
      return false;
    }

    setPassError("");
    return true;
  }

  // CONFIRM PASSWORD VALIDATION
  function validConfirmPass(confirmPass: string) {
    if (!confirmPass) {
      setConfirmPassError("Please confirm your password");
      return false;
    }

    if (confirmPass !== UserPas) {
      setConfirmPassError("Passwords do not match");
      return false;
    }

    setConfirmPassError("");
    return true;
  }

  // PHONE VALIDATION
  function validphone(phone: string) {
    if (!phone.trim()) {
      setPhoneError("Phone can't be empty");
      return false;
    }

    if (!/^(03\d{9}|92\d{10})$/.test(phone.trim())) {
      setPhoneError(
        "Enter 03001234567 or 923001234567"
      );
      return false;
    }

    setPhoneError("");
    return true;
  }

  // SIGN UP
  async function handlebutton() {
    const email = UserEmail.trim();

    if (
      !Username.trim() ||
      !email ||
      !UserPas ||
      !ConfirmPas ||
      !UserPhone.trim()
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const validname = validName(Username);
    const validemail = validEmail(email);
    const validPhone = validphone(UserPhone);
    const validpassword = validPass(UserPas);
    const validconfirm = validConfirmPass(ConfirmPas);

    if (
      !validname ||
      !validemail ||
      !validPhone ||
      !validpassword ||
      !validconfirm
    ) {
      return;
    }

    try {
      setLoading(true);

      const existEmail = await checkEmail(email);

      if (existEmail) {
        Alert.alert(
          "Email Already Registered",
          "Please use a different email address."
        );
        return;
      }

      const newUserId = await adduser(
        Username.trim(),
        email,
        UserPas,
        UserPhone.trim()
      );

      await AsyncStorage.setItem(
        "userId",
        String(newUserId)
      );

      // Main is registered in App.tsx
      navigation.replace("Main");
    } catch (error) {
      console.log("Signup failed:", error);

      Alert.alert(
        "Error",
        "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="cut-outline"
                size={35}
                color={Colors.gold}
              />
            </View>

            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>
              Start managing your tailor business
            </Text>
          </View>

          {/* NAME */}
          <Text style={styles.label}>Name</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={21}
              color={Colors.primary}
            />

            <TextInput
              style={styles.input}
              value={Username}
              onChangeText={value => {
                setName(value);
                setNameError("");
              }}
              onBlur={() => validName(Username)}
              placeholder="Enter your name"
              placeholderTextColor={Colors.placeholder}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {!!nameError && (
            <Text style={styles.errorText}>{nameError}</Text>
          )}

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={21}
              color={Colors.primary}
            />

            <TextInput
              style={styles.input}
              value={UserEmail}
              onChangeText={value => {
                setEmail(value);
                setEmailError("");
              }}
              onBlur={() => validEmail(UserEmail)}
              placeholder="Enter your email"
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {!!EmailError && (
            <Text style={styles.errorText}>{EmailError}</Text>
          )}

          {/* PHONE */}
          <Text style={styles.label}>Phone</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={21}
              color={Colors.primary}
            />

            <TextInput
              style={styles.input}
              value={UserPhone}
              onChangeText={value => {
                setPhone(value);
                setPhoneError("");
              }}
              onBlur={() => validphone(UserPhone)}
              placeholder="03001234567"
              placeholderTextColor={Colors.placeholder}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </View>

          {!!phoneError && (
            <Text style={styles.errorText}>{phoneError}</Text>
          )}

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color={Colors.primary}
            />

            <TextInput
              style={styles.input}
              value={UserPas}
              onChangeText={value => {
                setPas(value);
                setPassError("");

                if (ConfirmPas) {
                  setConfirmPassError(
                    value === ConfirmPas
                      ? ""
                      : "Passwords do not match"
                  );
                }
              }}
              onBlur={() => validPass(UserPas)}
              placeholder="Enter your password"
              placeholderTextColor={Colors.placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={21}
                color={Colors.primary}
              />
            </Pressable>
          </View>

          {!!passError && (
            <Text style={styles.errorText}>{passError}</Text>
          )}

          {/* CONFIRM PASSWORD */}
          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color={Colors.primary}
            />

            <TextInput
              style={styles.input}
              value={ConfirmPas}
              onChangeText={value => {
                setConfirmPas(value);
                setConfirmPassError(
                  value === UserPas
                    ? ""
                    : "Passwords do not match"
                );
              }}
              onBlur={() => validConfirmPass(ConfirmPas)}
              placeholder="Re-enter your password"
              placeholderTextColor={Colors.placeholder}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handlebutton}
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              hitSlop={10}
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={21}
                color={Colors.primary}
              />
            </Pressable>
          </View>

          {!!confirmPassError && (
            <Text style={styles.errorText}>
              {confirmPassError}
            </Text>
          )}

          {/* CREATE ACCOUNT */}
          <Pressable
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handlebutton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Create Account
              </Text>
            )}
          </Pressable>

          {/* SIGN IN */}
          <View style={styles.signin}>
            <Text style={styles.signinText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() => navigation.replace("SignIn")}
            >
              <Text style={styles.signinLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// COLORS
const Colors = {
  background: "#FFFFFF",
  primary: "#292929",
  text: "#292929",
  placeholder: "#999999",
  border: "#DDDDDD",
  card: "#FFFFFF",
  error: "#D32F2F",
  secondaryText: "#666666",
  button: "#292929",
  gold: "#C5A253",
};

// STYLES
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  container: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 25,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 31,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 19,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 7,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 5,
  },

  input: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },

  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 12,
  },

  button: {
    minHeight: 53,
    backgroundColor: Colors.button,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  signin: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 22,
  },

  signinText: {
    color: Colors.secondaryText,
    fontSize: 14,
  },

  signinLink: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 5,
    paddingVertical: 5,
  },
});
