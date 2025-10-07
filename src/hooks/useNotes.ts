import { useState, useEffect, useCallback } from 'react';
import api from '@/api/api';
import type { Note } from '@/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await api.get<Note[]>('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, fetchNotes };
}