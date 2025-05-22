import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../Api";

export const useBusNumbers = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["userBusNumbers"],
    queryFn: async () => {
      const response = await api.get("/scan/listBusno");
      console.log("hhhh =", response)
      return response.data;
    },
    enabled: !! AsyncStorage.getItem("user"), // ✅ Only fetch if token exists
    staleTime: 300000, // ✅ Cache for 5 minutes
    retry: false, // ✅ Avoid retrying if request fails
    onError: () => logout(),
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
    logout,
    refetchUser: refetch, // ✅ Allows manual refetch
  };
};