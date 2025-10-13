import api from '@/api/api';
import type { User } from '@/types';

export const fetchUser = async () => {
  try {
    const response = await api.get<User>('/api/user');
    return response.data;
  } catch (err) {
    console.error('Failed to fetch user:', err);
  }
}