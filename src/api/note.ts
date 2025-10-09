import api from '@/api/api';
import type { Note } from '@/types';

export const FetchNotes = async (): Promise<Note[]> => {
  const response = await api.get<Note[]>('/notes');
  return response.data;
};

export const UpdateNote = async (newNote: Note): Promise<Note> => {
  const response = await api.post<Note>('/notes-update', newNote);
  return response.data;
};