import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ListOrderScreen from '../screens/Orders/ListOrderScreen';
import Setting from '../screens/settings/Setting';
import Dashbord from '../Dashbord';
import CustomerStackNavigator from './CustomerStackNavigator';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C9A227',
        tabBarInactiveTintColor: '#777777',

        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
        },

        tabBarLabelStyle: {
          fontSize: 12,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Customers') {
            iconName = 'people-outline';
          } else if (route.name === 'Orders') {
            iconName = 'receipt-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }

          return (
            <Ionicons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashbord} />

      <Tab.Screen
        name="Customers"
        component={CustomerStackNavigator}
      />

      <Tab.Screen name="Orders" component={ListOrderScreen} />

      <Tab.Screen name="Settings" component={Setting} />
    </Tab.Navigator>
  );
}