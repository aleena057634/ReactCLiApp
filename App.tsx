
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import{  userTable }from "./src/database/table";

import SignUp from "./src/screens/auth/SignUp";
import SignIn from "./src/screens/auth/SignIn";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await userTable  ();
        setDatabaseReady(true);
      } catch (error) {
        console.log("Database initialization error:", error);
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
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignUp"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="SignUp"
          component={SignUp}
        />

        <Stack.Screen
          name="SignIn"
          component={SignIn}
        />

        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
