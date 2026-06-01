import axios from "axios";
import { TokenStorage } from "../services/General/Storage/TokenStorage";

const isNetworkError = (error: unknown): boolean => {
  return (
    axios.isAxiosError(error) &&
    !error.response &&
    error.message === "Network Error"
  );
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = TokenStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isNetworkError(error)) {
      console.warn("⚠️ Detectado error de red (Sin conexión)");
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = TokenStorage.getRefreshToken();
        const token = TokenStorage.getToken();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
          { 
            headers: { Authorization: `Bearer ${token}` } 
          }
        );

        if (data && data.token) {
          TokenStorage.setToken(data.token);
          if (data.refreshToken) {
            TokenStorage.setRefreshToken(data.refreshToken);
          }

          if (originalRequest.headers.set) {
            originalRequest.headers.set(
              "Authorization",
              `Bearer ${data.token}`,
            );
          } else {
            originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
          }
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

          return api(originalRequest);
        } else {
          throw new Error("Refresh token rechazado por el servidor");
        }
      } catch (refreshError) {
        TokenStorage.clearSession();
        globalThis.location.href = `/auth/login`; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);