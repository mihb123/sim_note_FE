import api from '@/api/api';
import type { Note } from '@/types';

export const FetchNotes = async (): Promise<Note[]> => {
  try {
    const response = await api.get<Note[]>('/api/notes');
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};


export const UpdateNote = async (newNote: Note): Promise<Note> => {
  try {
    const response = await api.post<Note>(`/api/notes-update/`, newNote);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const CreateNote = async (note: Partial<Note>): Promise<Note> => {
  try {
    const response = await api.post<Note>('/api/notes-create', note);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const DeleteNote = async (noteId: string): Promise<void> => {
  try {
    await api.delete(`/api/notes-delete/${noteId}`);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};