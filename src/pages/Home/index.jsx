import React, { useState, useEffect } from "react";
import {
  Linking,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  AppState,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from 'react-native-device-info';
import { useScanner } from "../../services/hooks/useScanner";
import { useAuth } from "../../services/hooks/useAuth";
import QRCodeScanner from "../../components/QRcodeScanner";
import { Colors } from "../../thems/Colors";

const Home = () => {
  const [currentBusNumber, setCurrentBusNumber] = useState(null);
  const [username, setUsername] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannerResponse, setScannerResponse] = useState([]);
  const [mode, setMode] = useState("scanner"); // 'scanner' or 'passExpiry'
const { userInfo } = useAuth();
  const { scanQR, passValidity, isLoading, error } = useScanner();
const EXPIRATION_HOURS = 18;

  // Check token expiration on app launch and resume
  const checkSessionValidity = async () => {
    const timestamp = await AsyncStorage.getItem("loginTimestamp");
    if (!timestamp) return;

    const loginTime = new Date(parseInt(timestamp));
    const now = new Date();
    const hoursElapsed = (now - loginTime) / (1000 * 60 * 60); // milliseconds → hours

    if (hoursElapsed > EXPIRATION_HOURS) {
      console.log("Session expired. Logging out.");
      await logout();
    }
  };
  

const checkAppVersion = async () => {
  try {
     const user = await AsyncStorage.getItem("user");
     const currentVersion = await AsyncStorage.getItem("appVersion");
     const jsonArray = JSON.parse(user);
     const buildNo = jsonArray[0]?.build_no;
    const latestVersion = buildNo;
    //const minRequiredVersion = data.minRequiredVersion;
    const storeUrl = "https://play.google.com"

    if (currentVersion !== latestVersion) {
      // ℹ️ Optional update
      Alert.alert(
        'Update Available',
        'A new version of the app is available. Would you like to update?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Update',
            onPress: () => Linking.openURL(storeUrl),
          },
        ]
      );
    }
  } catch (error) {
    console.error('Version check failed:', error);
  }
};
 useEffect(() => {
    checkAppVersion();
  }, []);
  useEffect(() => {
    checkSessionValidity();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkSessionValidity();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("user");
        const userData = userDataString ? JSON.parse(userDataString) : null;
        setUsername(userData[0]?.username);
        setCurrentBusNumber(userData[0]?.BusNo);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    fetchUserData();
  }, []);



  const QrCodeData = (data) => {
    if (!data?.[0]?.value) {
      Alert.alert('Invalid student');
      return;
    }

    if (mode === "scanner") {
      const payload = {
        admnno: data[0].value,
        username: username,
        BusNo: currentBusNumber,
      };
      scanQR(payload, {
        onSuccess: (user) => {
          if (user) {
            setIsScanning(false);
            setIsModalVisible(true);
            setScannerResponse(user);
          }
        },
        onError: () => {
          console.error("Scanning failed");
        },
      });
    } else {
      const payload = {
        admnno: data[0].value,
      };
      passValidity(payload, {
        onSuccess: (user) => {
          if (user) {
            setIsScanning(false);
            setIsModalVisible(true);
            setScannerResponse(user);
          }
        },
        onError: () => {
          console.error("Scanning failed");
        },
      });
    }
  };

  const toggleMode = () => {
   Alert.alert(
      'Confirm Action',
      `Are you sure you want to change camera mode to ${mode ==="scanner" ? "Check pass status" : "Scan student pass"} ?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('User canceled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => setMode((prevMode) => (prevMode === "scanner" ? "passExpiry" : "scanner")),
        },
      ],
      { cancelable: false }
    );
  };

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading bus numbers</Text>;

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ flex: Platform.OS === 'android' && parseInt(DeviceInfo.getSystemVersion(), 10) === 15 ? 0.80 : 0.85 }}>
        <QRCodeScanner
          QrCodeData={QrCodeData}
          isScanningApi={isScanning}
          isModalVisibleAPi={isModalVisible}
          scannerResponse={scannerResponse}
          scannerMode={mode}
        />
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
          <Text style={styles.toggleButtonText}>
            {mode === "scanner" ? "Check pass status" : "Scan student pass"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  toggleContainer: {
    flex: 0.15,
    alignItems: "flex-end",
    top: 5,
  },
  toggleButton: {
    width: 200,
    height: 40,
    backgroundColor: Colors.name.yellow,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.name.black,
    borderWidth: 0.5,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.name.black,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
});

export default Home;
