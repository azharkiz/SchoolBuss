import React, { useState, useEffect, useRef } from "react";
import { Linking, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";


const Home = () => {
  const camera = useRef(null);
  const [SwitchCameraValue, setSwitchCameraValue] = useState('front');
  const [flash, setFlash] = useState('off');
  const [showBorder, setShowBorder] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice(SwitchCameraValue);

  
const getPermission =async()=>{
      const cameraPermission = await Camera.requestCameraPermission();
      if(cameraPermission === 'denied') await Linking.openSettings();
      if(Platform.OS ==='ios'){
        const photoLibraryPermission = await Camera.requestPhotoLibraryPermission();
        if(photoLibraryPermission ==='denied') await Linking.openSettings();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
              title: 'Storage Permission',
              message: 'App need to your storage to save photos',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK'
            }
          );
          if(granted !== PermissionsAndroid.RESULTS.GRANTED){
            console.log('Storage Permission denied')
          }
        }
        catch(err) {}
      }
    }

  useEffect(() => {
   getPermission()
  }, []);
const codeScanner = useCodeScanner({
  codeTypes: ['qr', 'ean-13'],
  onCodeScanned: (codes) => {
    console.log(`Scanned ${codes.length} codes!`)
  }
})
  if (device == null) return <View style={styles.loadContainer} />

  return (
    <View style={[styles.container, {borderWidth: 2}]}>
      <SafeAreaView />
      <Camera
      ref={camera}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      photo={true}
      codeScanner={codeScanner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadContainer: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default Home;