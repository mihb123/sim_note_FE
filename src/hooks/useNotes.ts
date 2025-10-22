import type { Note, NotesMap } from "@/types";
import { create } from 'zustand';

type temp = {
  title: string;
  content: string;
  id: string;
}

interface NoteStore {
  notes: NotesMap;
  setNotes: (notes: Note[]) => void;
  updateNote: (newNote: Note) => void;
  addNoteToStore: (note: temp | Note) => void;
  deleteNoteFromStore: (id: string) => void;
  mergeNotes: (newNotes: Note[]) => void;
}

const useNotes = create<NoteStore>((set) => ({
  notes: {},
  setNotes: (notesArray) => set({
    notes: notesArray.reduce((acc, note) => {
      acc[note.id] = note;
      return acc;
    }, {} as NotesMap),
  }),
  updateNote: (newNote) => set((state) => ({
    notes: { ...state.notes, [newNote.id]: newNote },
  })),
  addNoteToStore: (note) => set((state) => ({
    notes: { ...state.notes, [note.id]: note as Note },
  })),
  deleteNoteFromStore: (id) => set((state) => {
    const newNotes = { ...state.notes };
    delete newNotes[id];
    return { notes: newNotes };
  }),
  mergeNotes: (newNotes) => set((state) => {
    const newNotesMap = newNotes.reduce((acc, note) => {
      acc[note.id] = note;
      return acc;
    }, {} as NotesMap);
    return { notes: { ...state.notes, ...newNotesMap } };
  }),
}));

export default useNotes;