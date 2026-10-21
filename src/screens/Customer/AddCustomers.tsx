
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

export default function AddCustomers() {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="person-add-outline"
                size={28}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.title}>Add Customer</Text>

            <Text style={styles.subtitle}>
              Enter customer details
            </Text>
          </View>

          {/* NAME */}
          <Text style={styles.label}>Name</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#C9A227"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter customer name"
              placeholderTextColor="#999999"
            />
          </View>

          {/* PHONE */}
          <Text style={styles.label}>Phone</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#C9A227"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
            />
          </View>

          {/* ADDRESS */}
          <Text style={styles.label}>Address</Text>

          <View style={styles.addressContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#C9A227"
            />

            <TextInput
              style={styles.addressInput}
              placeholder="Enter customer address"
              placeholderTextColor="#999999"
              multiline
            />
          </View>

          {/* BUTTON */}
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Customer</Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
    paddingBottom: 50,
  },

  form: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#C9A227',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#160909',
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginTop: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#160909',
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#160909',
  },

  addressContainer: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  addressInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#160909',
    minHeight: 75,
    textAlignVertical: 'top',
  },

  buttonContainer: {
    backgroundColor: '#C9A227',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
