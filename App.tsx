import React from "react";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native";
import { enableScreens } from 'react-native-screens';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ScreenContextProvider } from "./src/services/Context";
import Navigation from "./src/services/Navigation";
import { Colors } from "./src/thems/Colors";

const queryClient = new QueryClient();
const App = () => {
  enableScreens(false);
  return (
     <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.name.white }}>
    <SafeAreaView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ScreenContextProvider>
            <Navigation />
          </ScreenContextProvider>
           </QueryClientProvider>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
