import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../pages/Home';
import BusSelection from '../../pages/BusSelection';

const Stack = createNativeStackNavigator();

const DashStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Home" component={BusSelection} />
  </Stack.Navigator>
);

export default DashStack;
