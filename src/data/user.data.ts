import { fetchUser } from '@/api/user.api';
import useSWR from 'swr';

export function useUser() {
  const HOUR = 60 * 60 * 1000;
  const { data, mutate, error, isLoading } = useSWR('/api/user', fetchUser, {
    revalidateOnFocus: false,
    dedupingInterval: HOUR,
    revalidateOnReconnect: false
  });

  return { user: data, error, isLoading, mutate };
}