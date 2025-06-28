import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthStack from "./authStack";
import DashStack from "./dasboard";
import { useAuthCheck } from "../Context/AuthContext";

const AppStack = () => {
  const { isLoggedIn } = useAuthCheck();

  return (
     <SafeAreaProvider>
    <NavigationContainer>
      {isLoggedIn ? <DashStack /> : <AuthStack />}
    </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppStack;
