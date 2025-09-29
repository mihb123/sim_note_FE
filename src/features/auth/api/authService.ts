import axios from "axios";
import type { AuthResponse, LoginData, RegisterData } from "@features/auth/types";

const apiUrl = import.meta.env.VITE_API_HOST || "http://localhost:8000";
axios.defaults.baseURL = apiUrl;

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const loginService = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post("/api/login", data);
  return response.data;
};

export const registerService = async (data: RegisterData) => {
  const response = await axios.post("/api/register", data);
  return response.data;
};