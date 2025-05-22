import React, { useState, useEffect, useRef } from "react";
import { Linking, ActivityIndicator, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View, Text} from "react-native";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import { useBusNumbers } from "../../services/hooks/useBuses";

const Home = () => {
  const { user, isLoading, logout, error } = useBusNumbers();

  if (isLoading) return <ActivityIndicator />;

  if (error) return <Text>Error loading bus numbers</Text>;
  console.log('user', user);
  return (
    <View style={[styles.container, {borderWidth: 2}]}>
      <SafeAreaView />
      <View style={{flex: 0.5}}>
      {/* <QRCodeScanner /> */}
      </View>
      <View style={{ flex: 0.5}}>
        <TouchableOpacity >
          <Text>Logout</Text>
        </TouchableOpacity>
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