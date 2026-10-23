
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import OrderStackNavigation from './OrderStackNavigation';
import Dashbord from '../Dashbord';
import CustomerStackNavigator from './CustomerStackNavigator';
import ThemeContext from '../context/ThemeContext';
import SettingStackNavigation from './SettingStackNavigation';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Dashboard Stack
function HomeStackNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.success,
        },
        headerTintColor:"#fff",
        headerTitleStyle: {
          color: "#fff",
          fontSize: 20,
          fontWeight: '700',
        
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashbord}
        options={{
          title: 'Dashboard',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: theme.warning,
        tabBarInactiveTintColor: theme.accent,

        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border ?? theme.card,
         marginBottom:5,borderRadius:10
        },

        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
        },

        tabBarIcon: ({ color, size, focused }) => {
  const icons = {
    Home: focused ? 'home' : 'home-outline',
    Customers: focused ? 'people' : 'people-outline',
    Orders: focused ? 'receipt' : 'receipt-outline',
    Settings: focused ? 'settings' : 'settings-outline',
  } as const;

  const iconName = icons[route.name as keyof typeof icons];

  return (
    <Ionicons
      name={iconName}
      size={size}
      color={color}
    />
  );
},
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: 'Dashboard',
        }}
      />

      <Tab.Screen
        name="Customers"
        component={CustomerStackNavigator}
        options={{
          title: 'Customers',
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrderStackNavigation}
        options={{
          title: 'Orders',
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingStackNavigation}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
