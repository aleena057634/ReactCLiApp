
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddOrderScreen from '../screens/Orders/AddOrderScreen';
import DetailOrderScreen from '../screens/Orders/DetailOrderScreen';
import ListOrderScreen from '../screens/Orders/ListOrderScreen';

import ThemeContext from '../context/ThemeContext';
import MeasurementStackNavigation from './MeasurementStackNavigation';

const Stack = createNativeStackNavigator();

export default function OrderStackNavigation() {
  const { theme } = useContext(ThemeContext);

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
        name="OrderList"
        component={ListOrderScreen}
        options={{
          title: 'Orders',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="AddOrder"
        component={AddOrderScreen}
        options={{
          title: 'Add Order',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="DetailOrder"
        component={DetailOrderScreen}
        options={{
          title: 'Order Details',
          headerShown: true,
        }}
      />
<Stack.Screen
name="MeasurementStack"
component={MeasurementStackNavigation}
options={{headerShown:false}}
/>

    </Stack.Navigator>
  );
}
