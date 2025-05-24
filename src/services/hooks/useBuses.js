import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../Api";
import { useAuthCheck } from "../Context/AuthContext";

export const useBusNumbers = () => {
  const queryClient = useQueryClient();
  const { setIsLoggedIn } = useAuthCheck();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["userBusNumbers"],
    queryFn: async () => {
      const response = await api.get("/scan/listBusno");
      return response.data;
    },
    enabled: !! AsyncStorage.getItem("user"), // ✅ Only fetch if token exists
    staleTime: 300000, // ✅ Cache for 5 minutes
    retry: false, // ✅ Avoid retrying if request fails
    onError: () => logout(),
  });

   const changeBusMutation = useMutation({
    mutationFn: async ({ username, BusNo }) => {
      console.log("kilipoi =", username, BusNo);
      const response = await api.post("/scan/changebusno", {
        username,
        BusNo,
      });
      console.log("kilipoi =", response);
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

  // ✅ Handle logout
  const logout = () => {
    AsyncStorage.removeItem("user");
    queryClient.removeQueries(["userBusNumbers"]); // ✅ Clear cache on logout
    setIsLoggedIn('');
  };

  return {
    busNumbers: data || null, // ✅ Ensure consistent user data
    isLoading,
    error,
    changeBus: changeBusMutation.mutate,
    logout,
    refetchUser: refetch, // ✅ Allows manual refetch
  };
};