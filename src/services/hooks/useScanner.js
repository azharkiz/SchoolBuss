import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../Api";

export const useScanner = () => {
  const queryClient = useQueryClient();

   const scanQR = useMutation({
    mutationFn: async ({ admnno, username, BusNo }) => {
      console.log("resq:", admnno, username, BusNo);
      const response = await api.post("/scan", {
        admnno,
        username,
        BusNo,
      });
      console.log("response:", response);
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["scanQR"], { user });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err) => {
      if (err.response) {
        console.error("Server responded with error:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Axios error:", err.message);
      }
    },
  });

  // Logout function
  const clearStore = async () => {
    try {
      queryClient.removeQueries({ queryKey: ["scanQR"] });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

   const passValidity = useMutation({
    mutationFn: async ({ admnno }) => {
      const response = await api.post("/checkpass", {
        admnno,
      });
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["passValidity"], { user });
      queryClient.invalidateQueries({ queryKey: ["passValidity"] });
    },
    onError: (err) => {
      if (err.response) {
        console.error("Server responded with error:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Axios error:", err.message);
      }
    },
  });

  return {
    scanQR: scanQR.mutate,
    passValidity: passValidity.mutate,
    clearStore
  };
};