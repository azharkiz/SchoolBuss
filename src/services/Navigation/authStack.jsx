import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../pages/Login';
import Home from '../../pages/Home';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);

export default AuthStack;
