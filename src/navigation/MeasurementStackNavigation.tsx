
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddMeasurement from '../screens/Measurement/AddMeasurement';
import MeasurementForm from '../screens/Measurement/MeasurementForm';
import MeasurementList from '../screens/Measurement/MeasurementList';
import ThemeContext from '../context/ThemeContext';
import Relation from '../screens/Measurement/Relation';

const Stack = createNativeStackNavigator();

export default function MeasurementStackNavigation() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          color: '#ffffff',
          fontSize: 20,
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="MeasurementList"
        component={MeasurementList}
        options={{ title: 'Measurement List' }}
      />

      <Stack.Screen
        name="MeasurementForm"
        component={MeasurementForm}
        options={{ title: 'Measurement Form' }}
      />
       <Stack.Screen
        name="AddMeasurement"
        component={AddMeasurement}
        options={{ title: 'Measurement Type' }}
      />
 <Stack.Screen
        name="AddfamilyMeasurement"
        component={Relation}
        options={{ title: 'Add Family members ' }}
      />

    </Stack.Navigator>
  );
}
