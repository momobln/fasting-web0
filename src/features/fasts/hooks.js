import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/axios'
import { useAuth } from '../../auth/useAuth'

export const useFasts = () => {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['fasts'],
    queryFn: async () => (await api.get('/fasts')).data,
    enabled: !!token,
  })
}

export const useStartFast = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (fastingHours) => {
      if (!fastingHours) throw new Error("no number provided");

      try {
        const response = await api.post("/fasts/start", { fastingHours });
        return response.data;
      } catch (error) {
        throw new Error(
          error?.response?.data?.error || error?.message || "Unknown error"
        );
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fasts"] }),
    onError: (error) => {
      const message =
        error?.message || "An unknown error occurred";

      const details =
        error?.response?.data?.details
          ?.map((data) => data.message)
          .join(", ") || "";

      console.warn("⚠️ Error:", message, details);
    },
  });
};

export const useStopFast = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      if (!id) throw new Error("No ID provided");

      try {
        const response = await api.post(`/fasts/${id}/stop`);
        return response.data;
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.message ||
          "Unknown error stopping fast";

        throw new Error(message);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fasts"] }),
    onError: (error) => {
      const message = error?.message || "An unknown error occurred";
      const details =
        error?.response?.data?.details
          ?.map((d) => d.message)
          .join(", ") || "";

      console.warn("⚠️ Error:", message, details);
    },
  });
};


export const useWeeklyStats = () => {            
  const { token } = useAuth()
  return useQuery({
    queryKey: ['weekly'],
    queryFn: async () => (await api.get('/stats/weekly')).data,
    enabled: !!token,
    retry: false,
  })
}
