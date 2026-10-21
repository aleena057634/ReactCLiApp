
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Platform
  
 } from 'react-native';
 import { KeyboardAvoidingView}from 'react-native';
import Colors from '../../theme/Colors';
import Sizes from '../../theme/Spacing';

export default function SignIn() {
  const [Email, setEmail] = useState('');
  const [Pass, setPass] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setEmailError('Please enter a valid email');
      return false;
    }

    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPassError('Password is required');
      return false;
    }

    if (value.length < 8) {
      setPassError('Password must be at least 8 characters');
      return false;
    }

    setPassError('');
    return true;
  };

  const handleSignIn = () => {
    const isEmailValid = validateEmail(Email);
    const isPasswordValid = validatePassword(Pass);

    if (isEmailValid && isPasswordValid) {
      // Abhi sirf validation hai, actual login baad mein add hoga.
      console.log('Sign In form is valid');
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Sign In to StitchMate</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={Colors.placeholder}
        value={Email}
        onChangeText={(value) => {
          setEmail(value);

          if (emailError) {
            validateEmail(value);
          }
        }}
        onBlur={() => validateEmail(Email)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {emailError !== '' && (
        <Text style={styles.error}>{emailError}</Text>
      )}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor={Colors.placeholder}
        value={Pass}
        onChangeText={(value) => {
          setPass(value);

          if (passError) {
            validatePassword(value);
          }
        }}
        onBlur={() => validatePassword(Pass)}
        secureTextEntry
      />

      {passError !== '' && (
        <Text style={styles.error}>{passError}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    padding: Sizes.largeSpace,
    justifyContent: 'center',
  },
  title: {
    fontSize: Sizes.heading,
    fontWeight: Sizes.bold,
    color: Colors.text,
    marginBottom: Sizes.sectionSpace,
  },
  label: {
    fontSize: Sizes.labelText,
    fontWeight: Sizes.semiBold,
    color: Colors.text,
    marginBottom: Sizes.smallSpace,
  },
  input: {
    height: Sizes.inputHeight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.normalRadius,
    paddingHorizontal: Sizes.mediumSpace,
    color: Colors.text,
    backgroundColor: Colors.inputBackground,
    marginBottom: Sizes.smallSpace,
  },
  error: {
    color: Colors.danger,
    fontSize: Sizes.labelText,
    marginBottom: Sizes.mediumSpace,
  },
  button: {
    height: Sizes.buttonHeight,
    backgroundColor: Colors.primary,
    borderRadius: Sizes.normalRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Sizes.mediumSpace,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Sizes.normalText,
    fontWeight: Sizes.bold,
  },
});
