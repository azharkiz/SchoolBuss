import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../services/hooks/useAuth";
import { useScreenContext } from "../../services/Context";
import RNPickerSelect from 'react-native-picker-select';
import { useBusNumbers } from "../../services/hooks/useBuses";
import { Colors } from "../../thems/Colors";
import Loader from "../../components/Loader";

const Settings = () => {
  const screenContext = useScreenContext();
    const [selectedBus, setSelectedBus] = useState(null);
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
    console.log('user', userData);
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
};
useEffect(()=>{fetchUserData()},[])
    if (isLoading) return <Loader />;
  
    if (error) return <Text>Error loading bus numbers</Text>;
  
    const pickerItems = busNumbers.map(item => ({
      label: `Bus ${item.BusNo}`,
      value: item.BusNo,
    }));

  const changeBusNo =(value)=>{
    const payload ={
      username: username,
      BusNo: value
    }
    setSelectedBus(value)
    changeBus(payload, {
      onSuccess: (user) => {
      
      },
      onError: () => {
        setError("Invalid email or password.");
        
      },
    });
  }

  return (
    <View
      style={[screenStyles.container]}>
         <View style={screenStyles.section}>
            <Text style={screenStyles.sectionHeading}>User Information</Text>
    
      {username && <Text style={screenStyles.selected}>Name: {username}</Text>}
      {currentBusNumber && <Text style={screenStyles.selected}>Bus no: {currentBusNumber}</Text>}
          </View>
          <View style={screenStyles.section}>
            <Text style={screenStyles.sectionHeading}>Option for change bus</Text>
             <Text style={screenStyles.label}>Select a Bus Number:</Text>
      <RNPickerSelect
        onValueChange={(value) => changeBusNo(value)}
        items={pickerItems}
        placeholder={{ label: "Select Bus", value: null }}
        style={pickerSelectStyles}
      />
      {selectedBus && <Text style={screenStyles.selected}>Selected: Bus {selectedBus}</Text>}
          </View>

          <View style={screenStyles.logoutContainer}>
            <TouchableOpacity style={screenStyles.button} onPress={logout}>
              <MaterialIcons
                name="logout"
                color={Colors.name.white}
                size={24}
              />
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
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.name.lightGrey,
  },
  label: { marginBottom: 10, fontSize: 14, color:  Colors.name.darkGrey, fontWeight: 'bold',},
  selected: { marginTop: 20, fontSize: 14, fontWeight: 'bold', color:  Colors.name.darkGrey },
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
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    backgroundColor: '#f0f0f0',
  },
  inputAndroid: {
    fontSize: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    backgroundColor: '#f0f0f0',
    height:50,
  },
});
export default Settings;
