
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, StyleSheet, Platform, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Home from '../../pages/Home';
import BusSelection from '../../pages/BusSelection';
import Settings from "../../pages/Settings";
import { Colors } from "../../thems/Colors";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const DashStack = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        keyboardHidesTabBar: true,
        tabBarStyle: [
          styles.tabBarStyle,
          { backgroundColor: Colors.name.white },
        ],
        tabBarActiveTintColor: Colors.name.red,
        tabBarInactiveTintColor: Colors.name.grey,
        
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="camera" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" color={color} size={size} />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};

export default DashStack;

// Styles
const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    height: 60,
    color: Colors.name.darkBlue,
    backgroundColor: 'red',
  },
  container: {
    position: "absolute",
    bottom: 15,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "transparent", // Ensures no white background
    justifyContent: "center",
    alignItems: "center",
    left: 25,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: Colors.name.greyWhite,
    borderWidth: 5,
    backgroundColor: Colors.name.darkBlue,
    justifyContent: "center",
    alignItems: "center",
  },
});

