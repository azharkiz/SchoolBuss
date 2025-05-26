import React, { useState, useEffect, useRef } from "react";
import {
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  AppState,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { useScreenContext } from "../../services/Context/ScreenContext";
import Loader from "../Loader";
import { Colors } from "../../thems/Colors";
import { useBusNumbers } from "../../services/hooks/useBuses";

const Home = ({ QrCodeData, isScanningApi, isModalVisibleAPi, scannerResponse, scannerMode }) => {
  const camera = useRef(null);
  const screenContext = useScreenContext();
  const { clearStore}= useBusNumbers();
  const [SwitchCameraValue, setSwitchCameraValue] = useState("back");
  const [appState, setAppState] = useState(AppState.currentState);
  const [cameraActive, setCameraActive] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanresponseTitle, setScanresponseTitle] = useState(null);
  const device = useCameraDevice(SwitchCameraValue);
  const screenStyles = styles(scanResult, scannerMode);

  const getPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    if (cameraPermission === "denied") await Linking.openSettings();
    if (Platform.OS === "ios") {
      const photoLibraryPermission = await Camera.requestPhotoLibraryPermission();
      if (photoLibraryPermission === "denied") await Linking.openSettings();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to storage to save photos",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Storage Permission denied");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        setCameraActive(false);
        setTimeout(() => setCameraActive(true), 200);
      }
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, [appState]);

  useEffect(() => { getPermission(); }, []);

  useEffect(() => {
    if (scannerResponse && scannerResponse.length > 0) {
      const scanned = scannerResponse[0];
      setScanResult(scanned);
      setIsLoading(false);
      const titleMap = {
        1: "Successfully scanned",
        2: "Not a valid student",
        3: "No pass issued",
        4: "Pass expired on",
        5: scannerMode === 'scanner' ? "Pass scanned recently on" : "Active Pass on"
      };
      setScanresponseTitle(titleMap[scanned.flag] || "Unknown status");
    }
  }, [scannerResponse]);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      if (isScanning) {
        QrCodeData(codes);
        setIsScanning(false);
        setIsModalVisible(true);
      }
    },
  });

  if (!device) return <View style={screenStyles.loadContainer} />;

  return (
    <View style={screenStyles.container}>
      <SafeAreaView />
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={cameraActive}
        photo={true}
        codeScanner={codeScanner}
      />

      <View style={screenStyles.overlay}><View style={screenStyles.scannerBox} /></View>

      <Modal
        transparent
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={screenStyles.modalContainer}>
          <View style={screenStyles.modalContent}>
            {scanResult && !isLoading ? (
              <View style={{ width: '100%' }}>
                <Text style={screenStyles.modalTitle}>
                  {scanresponseTitle} {scanResult.lastscantime && new Date(scanResult.lastscantime).toLocaleString()}
                </Text>

                {[
                  { label: "Name", value: scanResult.name },
                  { label: "Admission No", value: scanResult.AdmnNo },
                  { label: "Class & Div", value: scanResult.ClassDiv },
                  { label: "Bus No", value: scanResult.BusNo },
                  { label: "Place", value: scanResult.Place },
                  { label: "Amount", value: `₹${scanResult.Amount}` },
                  { label: "Last Paid On", value: new Date(scanResult.LastPaidOn).toLocaleDateString() },
                  { label: "Last Scan", value: new Date(scanResult.lastscantime).toLocaleString() },
                ].map((item, index) => (
                  <View key={index} style={screenStyles.row}>
                    <Text style={screenStyles.label}>{item.label}:</Text>
                    <Text style={screenStyles.value}>{item.value}</Text>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                    setIsScanning(true);
                    clearStore
                  }}
                  style={screenStyles.modalButton}
                >
                  <Text style={screenStyles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            ) : <Loader />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (scanResult, scannerMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loadContainer: { flex: 1, backgroundColor: "black" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderColor: "#00FF00",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: scannerMode === "scanner" ? Colors.name.white : Colors.name.lightPurple,
    padding: 20,
    borderRadius: 10,
    width: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    backgroundColor:
      scanResult?.flag === 1 ? Colors.name.green :
      [2, 3, 4].includes(scanResult?.flag) ? Colors.name.red :
      scanResult?.flag === 5 ? Colors.name.yellow : Colors.name.black,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    maxWidth: "60%",
    textAlign: "right",
  },
  modalButton: {
    marginTop: 20,
    width: '80%',
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#00CC66",
    borderRadius: 6,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    alignSelf: 'center',
    fontSize: 16,
  },
});

export default Home;
