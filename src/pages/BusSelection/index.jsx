import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useBusNumbers } from "../../services/hooks/useBuses";

const BusSelection = () => {
  const [selectedBus, setSelectedBus] = useState(null);
 const { busNumbers, isLoading, logout, error } = useBusNumbers();

  if (isLoading) return <ActivityIndicator />;

  if (error) return <Text>Error loading bus numbers</Text>;

  const pickerItems = busNumbers.map(item => ({
    label: `Bus ${item.BusNo}`,
    value: item.BusNo,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Bus Number:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedBus(value)}
        items={pickerItems}
        placeholder={{ label: "Select Bus", value: null }}
        style={pickerSelectStyles}
      />
      {selectedBus && <Text style={styles.selected}>Selected: Bus {selectedBus}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginBottom: 10, fontSize: 16 },
  selected: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
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
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    backgroundColor: '#f0f0f0',
  },
});

export default BusSelection;
