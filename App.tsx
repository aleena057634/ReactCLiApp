
import React, { useEffect, useState, useContext } from 'react';
import SplashScreen from './src/SplashScreen';
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ThemeContextProvider from './src/context/ThemeContexProvider';
import ThemeContext from './src/context/ThemeContext';

import {
  userTable,
  Customer_Table,
} from './src/database/table';
import { Payment_Value,payment_table} from './src/database/payment';
import { order_Table } from './src/database/order';

import SignUp from './src/screens/auth/SignUp';
import SignIn from './src/screens/auth/SignIn';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import Payment from './src/screens/Payment';
import SettingStackNavigation from './src/navigation/SettingStackNavigation';
import { Order_Image } from './src/database/ImageCrud';
import OrderStackNavigation from './src/navigation/OrderStackNavigation';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'AppNavigation must be inside ThemeContextProvider',
    );
  }

  const { theme } = context;

  return (
    <NavigationContainer>
     <Stack.Navigator
  initialRouteName="SplashScreen"
  screenOptions={{
    headerStyle: {
      backgroundColor: theme.card,
    },
    headerTintColor: theme.text,
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.background,
    },
  }}
>
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown:true,
          }}
        />

        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="Dashboard"
          component={BottomTabNavigator}
          options={{
            headerShown:false,
          }}
        />
         <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            headerShown:true,
          }}
        />

          <Stack.Screen
          name="Setting"
          component={SettingStackNavigation}
          options={{
            headerShown:false,
          }}
        />

   <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown:false,
          }}
        />
          <Stack.Screen
          name="OrderStackNavigation"
          component={OrderStackNavigation}
          options={{
            headerShown:false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await userTable();
        await Customer_Table();
        await order_Table();
payment_table();
Order_Image();

        setDatabaseReady(true);
      } catch (error) {
        console.log('Database initialization error:', error);
      }
    }

    initializeDatabase();
  }, []);

  if (!databaseReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#292929" />
      </View>
    );
  }

  return (
    <ThemeContextProvider>
      <AppNavigation />
    </ThemeContextProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
