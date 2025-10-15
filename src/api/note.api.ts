import api from '@/api/api';
import type { Note, PaginationResponse } from '@/types';

export const FetchNotes = async (url: string): Promise<PaginationResponse<Note> | Note[]> => {
  try {
    const response = await api.get<PaginationResponse<Note>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

export const UpdateNote = async (newNote: Note): Promise<Note> => {
  const data = {
    title: newNote.title,
    content: newNote.content,
    updated_at: newNote.updated_at,
    is_save: newNote.is_save,
    id: newNote.id,
    user_id: newNote.user_id
  }
  
  try {
    const response = await api.post<Note>(`/api/notes-update/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const CreateNote = async (note: Partial<Note>): Promise<Note> => {
  const newNote = {
    title: note.title || 'Untitled',
    content: note.content || '',
  }
  try {
    const response = await api.post<Note>('/api/notes-create', newNote);
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