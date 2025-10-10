import type { Note, NotesMap } from "@/types";
import { create } from 'zustand';

export interface NoteStore {
  notes: NotesMap;
  focusNote: Note | null;
  setNotes: (notes: {[key: string]: Note}) => void;
  updateNote: (newNote: Note) => void;
  setFocusNote: (id: string) => void;
  DeleteNoteFromStore: (id: string) => void;
  AddNoteToStore: (note: Note) => void;
}

export const useNotes = create((set) => ({
  notes: {} as NotesMap,
  focusNote: null as Note | null,
  setNotes: (notes: {[key: string]: Note}) => set({ notes }),
  updateNote: (newNote: Note) => set((state: { notes: NotesMap }) => ({ notes: { ...state.notes, [newNote.id]: newNote } })),
  setFocusNote: (id: string) => set((state: { notes: NotesMap }) => {
    localStorage.setItem("focusNoteId", id);
    return { focusNote: state.notes[id] || null };
  }),
  DeleteNoteFromStore: (id: string) => set((state: { notes: NotesMap, focusNote: Note | null }) => {
    const newNotes = { ...state.notes };
    delete newNotes[id];
    const newFocusNote = state.focusNote?.id === id ? null : state.focusNote;
    return { notes: newNotes, focusNote: newFocusNote };
  }),
  AddNoteToStore: (note: Note) => set((state: { notes: NotesMap }) => ({ notes: { ...state.notes, [note.id]: note } }))
}));
