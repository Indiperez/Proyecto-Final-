import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/AuthApi";
import { getTokenLocalStorage } from "@/utils/localStorage";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!getTokenLocalStorage(),
  });
}
