import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform
} from "react-native";
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../services/hooks/useAuth";
import { useScreenContext } from "../../services/Context";
import RNPickerSelect from "react-native-picker-select";
import { useBusNumbers } from "../../services/hooks/useBuses";
import { Colors } from "../../thems/Colors";
import Loader from "../../components/Loader";

const Settings = () => {
  const screenContext = useScreenContext();
  const { userInfo } = useAuth();
  const [selectedBus, setSelectedBus] = useState(null);
  const [previousBus, setPreviousBus] = useState(null); // 🆕 store previous value
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [currentBusNumber, setCurrentBusNumber] = useState(null);
  const { busNumbers, isLoading, logout, changeBus, error } = useBusNumbers();
  const screenStyles = styles(
    screenContext,
    screenContext[screenContext.isPortrait ? "windowWidth" : "windowHeight"],
    screenContext[screenContext.isPortrait ? "windowHeight" : "windowWidth"]
  );
  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      setUsername(userData[0]?.username);
      setName(userData[0]?.Name);
      setCurrentBusNumber(userData[0].BusNo);
      setSelectedBus(userData[0].BusNo); // 🆕 set selectedBus
      setPreviousBus(userData[0].BusNo);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) return <Loader />;

  if (error) return <Text>Error loading bus numbers</Text>;

  const pickerItems = busNumbers.map((item) => ({
    label: `Bus ${item.BusNo}`,
    value: item.BusNo,
  }));

  const changeBusNo = (value) => {
    if (!value || value === selectedBus) return;

    Alert.alert(
      "Confirm Action",
      "Are you sure you want to change the bus number?",
      [
        {
          text: "Cancel",
          onPress: () => {
            // 🛑 Restore previous selection
            setSelectedBus(previousBus);
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setSelectedBus(value); // update UI
            setPreviousBus(value); // update backup
            const payload = { username, BusNo: value };

            changeBus(payload, {
              onSuccess: () => {
                userInfo(
                  { username },
                  {
                    onSuccess: () => fetchUserData(),
                    onError: () => console.error("Failed to refresh user info"),
                  }
                );
              },
              onError: () => {
                console.error("Failed to change bus");
                Alert.alert("Error", "Failed to change bus number.");
              },
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={[screenStyles.container]}>
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionHeading}>User Information</Text>

        {name && (
          <Text style={screenStyles.selected}>Name: {name}</Text>
        )}
        {currentBusNumber && (
          <Text style={screenStyles.selected}>Bus no: {currentBusNumber}</Text>
        )}
      </View>
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionHeading}>Option for change bus</Text>
        <Text style={screenStyles.label}>Select a Bus Number:</Text>
        <RNPickerSelect
          value={selectedBus} // ✅ controlled component
          onValueChange={(value) => changeBusNo(value)}
          items={pickerItems}
          placeholder={{ label: "Select Bus", value: null }}
          style={pickerSelectStyles}
        />
        {selectedBus && (
          <Text style={screenStyles.selected}>Selected: Bus {selectedBus}</Text>
        )}
      </View>

      <View style={screenStyles.logoutContainer}>
        <TouchableOpacity style={screenStyles.button} onPress={logout}>
          <MaterialIcons name="logout" color={Colors.name.white} size={24} />
          <Text style={screenStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (screenContext, width, height) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.name.yellow,
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.name.lightGrey,
  },
  label: {
    marginBottom: 10,
    fontSize: 14,
    color: Colors.name.darkGrey,
    fontWeight: "bold",
  },
  selected: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.name.darkGrey,
  },
  sectionHeading: {
    color: Colors.name.black,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTheme: {
    marginBottom: 2,
    paddingVertical: 5,
  },
  themeHeading: {
    color: Colors.name.darkGrey,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  themeView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 6,
  },
  themeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  themeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.name.mediumRed,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    backgroundColor: "#f0f0f0",
  },
  inputAndroid: {
    fontSize: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    backgroundColor: "#f0f0f0",
    height: 50,
  },
});
export default Settings;
