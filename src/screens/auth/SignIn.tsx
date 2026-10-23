import React, { useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";

import { ConfirmAlert } from "../../components/CustomAlert";
import ThemeContext from "../../context/ThemeContext";
import { SignInValidation } from "../../database/queries";




export default function SignIn() {
 
 const navigation=useNavigation<any>(); 
  const { theme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertPass, setAlertPass] = useState(false);
  const [Aalert, AshowAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [EmailError, setEmailError] = useState("");
  const [PassError, SetPassError] = useState("");

  function validateEmail(value: string) {
    const Email = value.trim();

    if (!Email) {
      setEmailError("Email can't be empty");
      return false;
    }

  const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;

    if (!emailPattern.test(Email)) {
      setEmailError("Invalid email");
      return false;
    }

    setEmailError("");
    return true;
  }

  function validatePassword(value: string) {
    const Password = value.trim();

    if (!Password) {
      SetPassError("Password can't be empty");
      return false;
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    if (!passwordPattern.test(Password)) {
      SetPassError(
        "Password must contain 8 characters, a number and a special character"
      );
      return false;
    }

    SetPassError("");
    return true;
  }

  async function checkUser(email: string, pass: string) {
    if (!email.trim() || !pass.trim()) {
      AshowAlert(true);
      return;
    }

    const validEmail = validateEmail(email);
    const validPassword = validatePassword(pass);

    if (!validEmail || !validPassword) {
      return;
    }

    setLoading(true);

    try {
      const Email = email.trim();
      const Password = pass.trim();

      const user = await SignInValidation(Email, Password);

      if (!user) {
        setAlertPass(true);
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem(
        "userId",
        String(user.ID)
      );

      navigation.replace("Dashboard");
      setLoading(false);
    } catch (error) {
      console.log("SIGN IN ERROR:", error);
      setLoading(false);
      setErrorAlert(true);
    }
  }

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === "ios" ? "padding" : "height"
      }
      style={styles.keyboardView}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            
            

            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Sign in to continue your Business
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* Email */}
            <Text style={styles.label}>
              Email
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.primary}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Enter your email"
                placeholderTextColor={theme.placeholder}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                 setEmailError("")
                }}
                onBlur={()=>{ validateEmail(email);}}
                keyboardType="email-address"
              />
            </View>

            {EmailError ? (
              <Text style={styles.errorText}>
                {EmailError}
              </Text>
            ) : null}

            {/* Password */}
            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.primary}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Enter your password"
                placeholderTextColor={theme.placeholder}
                value={pass}
                onChangeText={(value) => {
                  setPass(value);
                  SetPassError("");
                }} onBlur={()=>{validatePassword(pass)}}
                secureTextEntry={!showPass}
              />

              <Pressable
                onPress={() => setShowPass(!showPass)}
              >
                <Ionicons
                  name={
                    showPass
                      ? "eye"
                      : "eye-off"
                  }
                  size={20}
                  color={theme.primary}
                />
              </Pressable>
            </View>

            {PassError ? (
              <Text style={styles.errorText}>
                {PassError}
              </Text>
            ) : null}

            {/* Button */}
            {loading ? (
              <View style={styles.loader}>
                <ActivityIndicator
                  size="small"
                  color={theme.primary}
                />
              </View>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() =>
                  checkUser(email, pass)
                }
              >
                <Text style={styles.buttonText}>
                  Sign In
                </Text>
              </Pressable>
            )}
          </View>

          {/* Sign Up */}
          <Text style={styles.signup}>
            Don't have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() =>
                navigation.replace("SignUp")
              }
            >
              Sign Up
            </Text>
          </Text>

          {/* All Fields Alert */}
          <ConfirmAlert
            visible={Aalert}
            title="Error"
            Message="All Fields are required"
            onConfirm={() => {
              AshowAlert(false);
            }}
          />

          {/* Invalid Credentials Alert */}
          <ConfirmAlert
            visible={alertPass}
            title="Error"
            Message="Invalid Email and Password"
            onConfirm={() => {
              setAlertPass(false);
            }}
          />

          {/* Unexpected Error Alert */}
          <ConfirmAlert
            visible={errorAlert}
            title="Error"
            Message="Something went wrong during sign in"
            onConfirm={() => {
              setErrorAlert(false);
            }}
          />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    container: {
      flexGrow: 1,
      paddingHorizontal: 25,
      paddingTop: 45,
      paddingBottom: 35,
      justifyContent: "center",
    },

  header: { alignItems: "center", 
    marginBottom: 35,
     paddingHorizontal: 10, },

 

   title: { fontSize: 40, fontWeight: "900", 
    color: theme.primary, fontFamily:"Poppins_600SemiBold",
    textAlign: "center", letterSpacing: 0.3, },

   subtitle: { fontSize: 15, color: theme.primary,
     textAlign: "center", marginTop: 9, lineHeight: 20, },

    form: {
      width: "100%",
    },

    label: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 7,
    },

    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 52,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      paddingHorizontal: 15,
      marginBottom: 5,
    },

    inputText: {
      flex: 1,
      marginLeft: 13,
      fontSize: 15,
      color: theme.text,
    },

    errorText: {
      color: "#D32F2F",
      fontSize: 12,
      marginLeft: 4,
      marginBottom: 14,
    },

    button: {
      height: 53,
      backgroundColor: theme.primary,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 4,
      elevation: 3,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },

    loader: {
      height: 53,
      justifyContent: "center",
      alignItems: "center",
    },

    signup: {
      textAlign: "center",
      marginTop: 22,
      color: theme.secondaryText,
      fontSize: 14,
    },

    signupLink: {
      color: theme.primary,
      fontWeight: "800",
    },
  });