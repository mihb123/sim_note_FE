import type { NotesMap, NoteMetaData, Note } from "@/types";
import { create } from 'zustand';

type temp = {
  title: string;
  content: string;
  id: string;
}

interface NoteStore {
  notes: NotesMap;
  setNotes: (notes: NoteMetaData[]) => void;
  updateNote: (newNote: NoteMetaData) => void;
  addNoteToStore: (note: temp | Note) => void;
  deleteNoteFromStore: (id: string) => void;
  mergeNotes: (newNotes: NoteMetaData[]) => void;
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
    notes: { ...state.notes, [note.id]: note as NoteMetaData },
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