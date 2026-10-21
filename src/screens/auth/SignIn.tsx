
import React, { useState } from 'react';

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
} from 'react-native';

import { Ionicons } from '@react-native-vector-icons/ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import { SignInValidation } from '../../database/queries';

export default function SignIn() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');

  // EMAIL VALIDATION
  function validateEmail(value: string) {
    const Email = value.trim();

    if (!Email) {
      setEmailError("Email can't be empty");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;

    if (!emailPattern.test(Email)) {
      setEmailError('Invalid email');
      return false;
    }

    setEmailError('');
    return true;
  }

  // PASSWORD VALIDATION
  function validatePassword(value: string) {
    if (!value.trim()) {
      setPassError("Password can't be empty");
      return false;
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    if (!passwordPattern.test(value)) {
      setPassError(
        'Password must contain 8 characters, a number and a special character',
      );
      return false;
    }

    setPassError('');
    return true;
  }

  // SIGN IN
  async function checkUser() {
    const validEmail = validateEmail(email);
    const validPassword = validatePassword(pass);

    if (!validEmail || !validPassword) {
      return;
    }

    try {
      setLoading(true);

      const user = await SignInValidation(email.trim(), pass);

      if (!user) {
        Alert.alert('Sign In Failed', 'Invalid email or password');
        return;
      }

      await AsyncStorage.setItem('userId', String(user.ID));

      // Main is registered in App.tsx
      navigation.replace('Main');
    } catch (error) {
      console.log('SIGN IN ERROR:', error);

      Alert.alert('Error', 'Something went wrong during sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="cut-outline" size={34} color={Colors.gold} />
            </View>

            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Sign in to continue your business
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            {/* EMAIL */}
            <Text style={styles.label}>Email</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={21}
                color={Colors.primary}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Enter your email"
                placeholderTextColor={Colors.placeholder}
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  setEmailError('');
                }}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            {/* PASSWORD */}
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color={Colors.primary}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Enter your password"
                placeholderTextColor={Colors.placeholder}
                value={pass}
                onChangeText={value => {
                  setPass(value);
                  setPassError('');
                }}
                onBlur={() => validatePassword(pass)}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={checkUser}
              />

              <Pressable
                onPress={() => setShowPass(previous => !previous)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  showPass ? 'Hide password' : 'Show password'
                }
              >
                <Ionicons
                  name={showPass ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color={Colors.primary}
                />
              </Pressable>
            </View>

            {passError ? (
              <Text style={styles.errorText}>{passError}</Text>
            ) : null}

            {/* SIGN IN BUTTON */}
            <Pressable
              style={[
                styles.button,
                loading && styles.disabledButton,
              ]}
              onPress={checkUser}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          {/* SIGN UP LINK */}
          <View style={styles.signup}>
            <Text style={styles.signupText}>
              Don't have an account?
            </Text>

            <Pressable onPress={() => navigation.replace('SignUp')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// COLORS
const Colors = {
  background: '#FFFFFF',
  primary: '#292929',
  gold: '#C9A227',
  text: '#292929',
  placeholder: '#999999',
  border: '#DDDDDD',
  card: '#FFFFFF',
  error: '#D32F2F',
  secondaryText: '#666666',
  button: '#292929',
};

// STYLES
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 35,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 35,
    paddingHorizontal: 10,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 15,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 9,
    lineHeight: 20,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 6,
  },

  inputText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 10,
  },

  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 14,
  },

  button: {
    height: 53,
    backgroundColor: Colors.button,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  signup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  signupText: {
    color: Colors.secondaryText,
    fontSize: 14,
  },

  signupLink: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 5,
  },
});
