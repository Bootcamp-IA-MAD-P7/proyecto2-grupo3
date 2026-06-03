import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axiosClient";
import { TokenStorage } from "../services/General/Storage/TokenStorage";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  empleado: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
}

export const useAuthenticate = () =>
  useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (data) => api.post("/auth/login", data).then((r) => r.data),
    onSuccess: (data) => {
      TokenStorage.setToken(data.token);
      TokenStorage.setRefreshToken(data.refreshToken);
      TokenStorage.setUserData(JSON.stringify(data.empleado));
    },
  });
