import { getTokenLocalStorage } from "@/utils/localStorage";
import axios from "axios";

const PUBLIC_ROUTES = [
  "/auth/log-in",
  "/auth/create-account",
  "/auth/confirm-account",
  "/auth/request-code",
  "/auth/forgot-password",
  "/auth/validate-token",
];

const api = axios.create({ baseURL: import.meta.env.VITE_BASE_API_URL });

api.interceptors.request.use((config) => {
  // No agregar el token si la ruta es pública
  if (!PUBLIC_ROUTES.some((route) => config.url?.startsWith(route))) {
    const token = getTokenLocalStorage();
    if (!token) throw new Error("Token Not Found");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
