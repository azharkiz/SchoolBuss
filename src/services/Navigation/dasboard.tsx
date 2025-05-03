import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../pages/Home';

// Define the types for the navigation stack
export type DashStackParamList = {
  Home: undefined; // No params expected for the Login screen
};

const DashboardStack = createNativeStackNavigator<DashStackParamList>();

// Login Stack Navigator
const DashStack = () => (
  <DashboardStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <DashboardStack.Screen name="Home" component={Home} />
  </DashboardStack.Navigator>
);

export default DashStack;
