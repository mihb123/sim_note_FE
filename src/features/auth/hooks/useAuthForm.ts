import { useState, type FormEvent, type ChangeEvent } from 'react';
import { loginService, registerService } from '@/features/auth/api/authService';
import type { LoginData, RegisterData, Fields, FormType, AuthResponse} from "@/features/auth/types";
import { useNavigate } from "react-router-dom";

const initialFields: Fields = {
  email: '',
  password: '',
  name: '',
  password_confirmation: '',
};

export const useAuthForm = (formType: FormType) => {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Fields>(initialFields);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev: Fields) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev: Fields) => ({ ...prev, [name]: '' }));
    }
  };

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { ...initialFields };
    const { email, password, name, password_confirmation } = fields;

    // --- Common Validations ---
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // --- Register-specific Validations ---
    if (formType === 'register') {
      if (!name) {
        newErrors.name = 'Full name is required';
      }
      if (password !== password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.values(validationErrors).some(error => error)) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setErrors(initialFields);

    let submissionData: LoginData | RegisterData;
    if (formType === 'register') {
      submissionData = fields as RegisterData;
    } else {
      const { name, password_confirmation, ...rest } = fields;
      submissionData = rest as LoginData;
    }
    
    if (formType === 'register') {
      registerService(submissionData as RegisterData)
        .then((res: AuthResponse) => {
          if (res.token) {
            localStorage.setItem('auth_token', res.token)
            navigate('/')          
          } else {
            alert(res.message)
          }
        })
        .catch((e) => console.error(e))
        .finally(()=>setIsLoading(false))
    } else if (formType == 'login') {
      loginService(submissionData as LoginData)
        .then((res: AuthResponse) => {
          if (res.token) {
            localStorage.setItem('auth_token', res.token)
            navigate('/')
          } else {
            alert(res.message)
          }
        })
        .catch((e) => console.error(e))
        .finally(() => setIsLoading(false))
    }
  };

  return { fields, errors, handleChange, handleSubmit, isLoading };
};