import React from "react";
import { SafeAreaView } from "react-native";
import { ScreenContextProvider } from "./src/services/Context";
import Navigation from "./src/services/Navigation";

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
          <ScreenContextProvider>
            <Navigation />
          </ScreenContextProvider>
    </SafeAreaView>
  );
};

export default App;
