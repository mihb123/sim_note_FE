export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface Fields {
  email: string;
  password: string;
  name?: string;
  password_confirmation?: string;
}

export type FormType = 'login' | 'register';