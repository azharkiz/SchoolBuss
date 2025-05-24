import React, { useState, useEffect, useRef } from "react";
import { Linking, ActivityIndicator, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View, Text} from "react-native";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import { useBusNumbers } from "../../services/hooks/useBuses";
import QRCodeScanner from "../../components/QRcodeScanner"
import { Colors } from "../../thems/Colors";

const Home = () => {
  const { user, isLoading, logout, error } = useBusNumbers();

  if (isLoading) return <ActivityIndicator />;

  if (error) return <Text>Error loading bus numbers</Text>;
  console.log('user', user);
  return (
    <View style={[styles.container, {borderWidth: 2}]}>
      <SafeAreaView />
      <View style={{flex: 0.85}}>
      <QRCodeScanner />
      </View>
      <View style={{ flex: 0.15, flexDirection: 'row'}}>
        <View style={{ flex: 1, alignItems: 'center'}}>
        <TouchableOpacity style={{ alignSelf: 'center', top: 10, width: 150, height: 40, backgroundColor: Colors.name.yellow, borderColor: Colors.name.black, borderWidth: 0.5, borderRadius: 4}}>
          <Text style={{ alignSelf: 'center', top: 10 }}>scanner</Text>
        </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center'}}>
          <TouchableOpacity style={{ alignSelf: 'center', top: 10, width: 150, height: 40, backgroundColor: Colors.name.yellow,  borderColor: Colors.name.black, borderWidth: 0.5, borderRadius: 4}}>
          <Text style={{ alignSelf: 'center', top: 10 }}>Pass Expiry</Text>
        </TouchableOpacity>
        </View>
        
       
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadContainer: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default Home;