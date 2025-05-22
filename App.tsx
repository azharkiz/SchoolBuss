import React from "react";
import { SafeAreaView } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ScreenContextProvider } from "./src/services/Context";
import Navigation from "./src/services/Navigation";

const queryClient = new QueryClient();
const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ScreenContextProvider>
            <Navigation />
          </ScreenContextProvider>
           </QueryClientProvider>
    </SafeAreaView>
  );
};

export default App;
