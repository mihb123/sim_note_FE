import { useState, FormEvent, ChangeEvent } from 'react';
import { loginService, registerService } from '../api/authService';
import type { LoginData, RegisterData } from "@features/auth/types";

type FormType = 'login' | 'register';

const initialFields = {
  email: '',
  password: '',
  name: '',
  password_confirmation: '',
};

export const useAuthForm = (formType: FormType) => {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState(initialFields);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

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

    setErrors(initialFields);

    let submissionData: LoginData | RegisterData;
    if (formType === 'register') {
      submissionData = fields as RegisterData;
    } else {
      const { name, password_confirmation, ...rest } = fields;
      submissionData = rest as LoginData;
    }
    
    const submitAction = formType === 'register' ? registerService : loginService;
    submitAction(submissionData as any)
      .then((response) => {
        console.log('Success:', response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return { fields, errors, handleChange, handleSubmit };
};