import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListCustomerScreen from '../screens/Customer/ListCustomerScreen';
import AddCustomers from '../screens/Customer/AddCustomers';
import DetailedCustomerScreen from '../screens/Customer/DetailedCustomerScreen';
import OrderStackNavigation from './OrderStackNavigation';
import MeasurementStackNavigation from './MeasurementStackNavigation';
const Stack = createNativeStackNavigator();
import ThemeContext from '../context/ThemeContext';
export default function CustomerStackNavigator() {
  const {theme}=useContext(ThemeContext)
  return (
        <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.success,
        },
        headerTintColor: "#ffff",
        headerTitleStyle: {
          color: "#ffff",
          fontSize: 20,
          fontWeight: '700',
        },
        // headerTitleAlign: 'left',
        // headerShadowVisible: false,
        // headerBackTitle: 'Back',
        // contentStyle: {
        //   backgroundColor: "#ffff",
        // },
      }}
    >
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
      <Stack.Screen name="MeasurementStack" 
      component={MeasurementStackNavigation}
      options={{headerShown:false}}
       />
    </Stack.Navigator>
  );
}