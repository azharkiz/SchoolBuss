import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useAuthCheck } from "../Context/AuthContext";
import api from "../Api";
import { AppState } from "react-native";

const EXPIRATION_HOURS = 18;

export const useAuth = () => {
  const { setIsLoggedIn } = useAuthCheck();
  const queryClient = useQueryClient();

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "loginTimestamp"]);
      queryClient.removeQueries({ queryKey: ["userProfile", "userLogin"] });
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await api.post("/login", { username, password });
      const userData = response.data;

      await AsyncStorage.setItem("loginTimestamp", Date.now().toString());
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      try {
        await AsyncStorage.setItem("appVersion", "1.0.0"); // ✅ Save version
      } catch (e) {
        console.error("Failed to save version:", e);
      }

      return userData;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["userLogin"], user);
      queryClient.invalidateQueries({ queryKey: ["userLogin"] });
    },
    onError: (err) => {
      console.error("Login error:", err?.response?.data || err?.message || err);
    },
  });

  // Get User Info mutation
  const getUserInfoMutation = useMutation({
    mutationFn: async ({ username }) => {
      const response = await api.post("/getuserinfo", { username });
      const userInfo = response.data;

      await AsyncStorage.setItem("user", JSON.stringify(userInfo));
      return userInfo;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["userProfile"], user);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err) => {
      console.error(
        "Get user info error:",
        err?.response?.data || err?.message || err
      );
    },
  });

  return {
    userInfo: getUserInfoMutation.mutate,
    login: loginMutation.mutate,
    logout,
  };
};
