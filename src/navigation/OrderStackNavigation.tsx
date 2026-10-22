
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddOrderScreen from '../screens/Orders/AddOrderScreen';
import DetailOrderScreen from '../screens/Orders/DetailOrderScreen';
import ListOrderScreen from '../screens/Orders/ListOrderScreen';

const Stack = createNativeStackNavigator();

export default function OrderStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderList"
        component={ListOrderScreen}
        options={{ title: 'Orders List' }}
      />

      <Stack.Screen
        name="AddOrder"
        component={AddOrderScreen}
        options={{ title: 'Add Order' }}
      />

      <Stack.Screen
        name="DetailOrder"
        component={DetailOrderScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
}
