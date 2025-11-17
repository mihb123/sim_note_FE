import api from '@/api/api';
import type { Note, NoteMetaData, PaginationResponse, ShareNoteResponse } from '@/types';

export const FetchNotes = async (url: string): Promise<PaginationResponse<NoteMetaData>> => {
  try {
    const response = await api.get<PaginationResponse<NoteMetaData>>(url)
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

export const CreateNote = async (note: Partial<NoteMetaData>): Promise<NoteMetaData> => {
  const newNote = {
    title: note.title || 'Untitled',
    content: note.content || '',
  }
  try {
    const response = await api.post<NoteMetaData>('/api/notes-create', newNote);
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

export const FetchNoteId = async (noteId: string): Promise<NoteMetaData> => {
  try {
    const res = await api.get<NoteMetaData>(`/api/notes/${noteId}`)
    return res.data
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

export const AddCollaborator = async (noteId: string, email: string): Promise<ShareNoteResponse> => {
  const data = { email };
  try {
    const response = await api.post <ShareNoteResponse>(`/api/notes-share/${noteId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
}

export const RemoveCollaborator = async (shareId: string): Promise<ShareNoteResponse> => {
  try {
    const response = await api.delete<ShareNoteResponse>(`/api/notes-unshare/${shareId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing collaborator:', error);
    throw error;
  }
}
