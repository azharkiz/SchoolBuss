import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useAuthCheck } from "../Context/AuthContext";
import api from "../Api";

export const useAuth = () => {
  const { setIsLoggedIn } = useAuthCheck();
  const queryClient = useQueryClient();

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    queryClient.removeQueries({ queryKey: ["userProfile"] });
    setIsLoggedIn(false);
  };

  // 👇 login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await api.post("/login", {
        username,
        password,
      });
      console.log("resp =", response);
      await AsyncStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["userProfile"], { user });
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

  return {
    login: loginMutation.mutate,
    logout,
  };
};
