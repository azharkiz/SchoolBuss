import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../../thems/Colors';
const Loader = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          style={styles.loadingView}
          size="large"
          color={Colors.name.rosyRed}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingView: { marginLeft: -12 },
  loadingText: { color: Colors.name.black },
});
