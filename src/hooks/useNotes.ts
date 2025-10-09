import type { Note, NotesMap } from "@/types";
import { create } from 'zustand';

export interface NoteStore {
  notes: NotesMap;
  focusNote: Note | null;
  setNotes: (notes: {[key: string]: Note}) => void;
  updateNote: (newNote: Note) => void;
  setFocusNote: (id: string) => void;
}

export const useNotes = create((set) => ({
  notes: {} as NotesMap,
  focusNote: null as Note | null,
  setNotes: (notes: {[key: string]: Note}) => set({ notes }),
  updateNote: (newNote: Note) => set((state: { notes: NotesMap }) => ({ notes: { ...state.notes, [newNote.id]: newNote } })),
  setFocusNote: (id: string) => set((state: { notes: NotesMap }) => ({ focusNote: state.notes[id] || null })),
}));
