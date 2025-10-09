import type { Note, NotesMap } from "@/types";
import { create } from 'zustand';

export const useNotes = create((set) => ({
  notes: {} as NotesMap,
  focusNote: null as Note | null,
  setNotes: (notes: {[key: string]: Note}) => set({ notes }),
  updateNote: (newNote: Note) => set((state: { notes: NotesMap }) => ({ notes: { ...state.notes, [newNote.id]: newNote } })),
  setFocusNote: (id: string) => set((state: { notes: NotesMap }) => ({ focusNote: state.notes[id] || null })),
}));
