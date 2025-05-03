import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../pages/Login';

// Define the types for the navigation stack
export type AuthStackParamList = {
  Login: undefined; // No params expected for the Login screen
};

const LoginStack = createNativeStackNavigator<AuthStackParamList>();

// Login Stack Navigator
const AuthStack = () => (
  <LoginStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <LoginStack.Screen name="Login" component={Login} />
  </LoginStack.Navigator>
);

export default AuthStack;
