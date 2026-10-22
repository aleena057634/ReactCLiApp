
import React, { useEffect, useState, useContext } from 'react';

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

import { order_Table } from './src/database/order';

import SignUp from './src/screens/auth/SignUp';
import SignIn from './src/screens/auth/SignIn';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

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
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.borderFocus,
          },
          headerTintColor: theme. success,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color:theme.background
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: "#4b4343",
          },
        }}
      >
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{
            headerShown:true,
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
