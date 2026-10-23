import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import ThemeContext from '../context/ThemeContext';
import OrderStackNavigation from './OrderStackNavigation';
import ChangePass from '../screens/settings/ChangePass';
import Setting from '../screens/settings/Setting';
import Profile from '../screens/settings/Profile';

export default function SettingStackNavigation() {
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
    <Stack.Screen name='Setting' component={Setting}/>
       <Stack.Screen name='Profile' component={Profile}/>
          <Stack.Screen name='ChangePass' component={ChangePass}/>
 </Stack.Navigator>
  )
}