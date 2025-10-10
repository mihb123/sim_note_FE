import api from "@/api/api";
import type { AuthResponse, LoginData, RegisterData } from "@/features/auth/types";

export const loginService = async (data: LoginData): Promise<AuthResponse> => {
  await api.get("/sanctum/csrf-cookie");
  const response = await api.post("/api/login", data);
  return response.data;
};

export const registerService = async (data: RegisterData) => {
  const response = await api.post("/api/register", data);
  return response.data;
};

export const verifyEmailService = async () => {
  const response = await api.get('/api//email/verification-notification');
  return response.data;
};

export const logoutService = async () => {
  const response = await api.post("/api/logout");
  return response.data;
};