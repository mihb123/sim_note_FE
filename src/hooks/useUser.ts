import { useState, useEffect, useCallback } from 'react';
import api from '@/api/api';
import type { User } from '../types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get<User>('/user');
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, fetchUser };
}