import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./authStack";
import DashStack from "./dasboard";
import { useAuthCheck } from "../Context/AuthContext";

const AppStack = () => {
  const { isLoggedIn } = useAuthCheck();

  return (
    <NavigationContainer>
      {isLoggedIn ? <DashStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppStack;
