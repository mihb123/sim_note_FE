import api from "@/api/api";
import type { AuthResponse, LoginData, RegisterData } from "@/features/auth/types";

export const loginService = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/login", data);
  return response.data;
};

export const registerService = async (data: RegisterData) => {
  const response = await api.post("/register", data);
  return response.data;
};

export const verifyEmailService = async () => {
  const response = await api.get('/email/verification-notification');
  return response.data;
};

export const logoutService = async () => {
  const response = await api.post('/logout');
  return response.data;
};