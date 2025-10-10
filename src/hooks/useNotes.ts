import type { Note, NotesMap } from "@/types";
import { create } from 'zustand';

export interface NoteStore {
  notes: NotesMap;
  setNotes: (notes: { [key: string]: Note }) => void;
  updateNote: (newNote: Note) => void;
  addNoteToStore: (note: Note) => void;
  deleteNoteFromStore: (id: string) => void;
}

export const useNotes = create<NoteStore>((set) => ({
  notes: {} as NotesMap,
  setNotes: (notes) => set({ notes }),
  updateNote: (newNote) => set((state) => ({
    notes: { ...state.notes, [newNote.id]: newNote },
  })),
  addNoteToStore: (note) => set((state) => ({
    notes: { ...state.notes, [note.id]: note },
  })),
  deleteNoteFromStore: (id) => set((state) => {
    const newNotes = { ...state.notes };
    delete newNotes[id];
    return { notes: newNotes };
  }),
}));