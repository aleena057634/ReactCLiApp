
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { AddUser } from '../../database/UsersDatabase';

export default function SignUp({ navigation }: any) {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Pass, setPass] = useState('');
  const [Phone, setPhone] = useState('');
  const [ConPas, setConPas] = useState('');
  const [Loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const name = Name.trim();
    const email = Email.trim().toLowerCase();
    const phone = Phone.trim();

    if (!name || !email || !Pass || !phone || !ConPas) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (Pass.length < 8) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long.',
      );
      return;
    }

    if (!/[A-Z]/.test(Pass) || !/[a-z]/.test(Pass) || !/[0-9]/.test(Pass)) {
      Alert.alert(
        'Error',
        'Password must contain uppercase, lowercase and a number.',
      );
      return;
    }

    if (!/^03\d{9}$/.test(phone)) {
      Alert.alert(
        'Error',
        'Enter a valid Pakistani mobile number, e.g. 03001234567.',
      );
      return;
    }

    if (Pass !== ConPas) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await AddUser(name, email, phone, Pass);

      Alert.alert(
        'Success',
        'Your account has been created successfully.',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.replace('SignIn'),
          },
        ],
      );
    } catch (error: any) {
      const message = String(error?.message ?? error ?? '');

      if (
        message.toLowerCase().includes('unique') ||
        message.toLowerCase().includes('constraint')
      ) {
        Alert.alert(
          'Account Exists',
          'This email address is already registered.',
        );
      } else {
        console.log('Signup error:', error);
        Alert.alert(
          'Error',
          'Unable to create your account. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.appName}>StitchMate</Text>
        <Text style={styles.tagline}>Your Style, Your Stitch</Text>
      </View>

      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subtitle}>
        Start managing your tailoring business.
      </Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        placeholder="Enter your full name"
        placeholderTextColor="#999999"
        value={Name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
        editable={!Loading}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#999999"
        value={Email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        editable={!Loading}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        placeholder="03001234567"
        placeholderTextColor="#999999"
        value={Phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={11}
        style={styles.input}
        editable={!Loading}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Create a password"
        placeholderTextColor="#999999"
        value={Pass}
        onChangeText={setPass}
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
        editable={!Loading}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        placeholder="Re-enter your password"
        placeholderTextColor="#999999"
        value={ConPas}
        onChangeText={setConPas}
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
        editable={!Loading}
      />

      <TouchableOpacity
        style={[styles.button, Loading && styles.disabledButton]}
        onPress={handleSignUp}
        activeOpacity={0.8}
        disabled={Loading}
      >
        {Loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          disabled={Loading}
        >
          <Text style={styles.loginButton}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222222',
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 13,
    color: '#C9A227',
    marginTop: 5,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 17,
    color: '#222222',
    fontSize: 15,
  },

  button: {
    backgroundColor: '#222222',
    paddingVertical: 15,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#555555',
    fontSize: 14,
  },

  loginButton: {
    color: '#C9A227',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
