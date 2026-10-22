import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListCustomerScreen from '../screens/Customer/ListCustomerScreen';
import AddCustomers from '../screens/Customer/AddCustomers';
import DetailedCustomerScreen from '../screens/Customer/DetailedCustomerScreen';
import OrderStackNavigation from './OrderStackNavigation';
const Stack = createNativeStackNavigator();

export default function CustomerStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerList"
        component={ListCustomerScreen}
        options={{ title: 'Customers' }}
      />

      <Stack.Screen
        name="AddCustomer"
        component={AddCustomers}
        options={{ title: 'Add Customer' }}
      />

      <Stack.Screen
        name="CustomerDetail"
        component={DetailedCustomerScreen}
        options={{ title: 'Customer Details' }}
      />

      <Stack.Screen
  name="OrderStack"
  component={OrderStackNavigation}
/>
    </Stack.Navigator>
  );
}