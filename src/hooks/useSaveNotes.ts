import type { Note } from '@/types';
import { create } from 'zustand';

interface SaveNoteStore{
  saveNotes: Note[];
  setSaveNotes: (notes: Note[]) => void;
}

const useSaveNotes = create<SaveNoteStore>((set) => ({
  saveNotes: [],
  setSaveNotes: (notes) => set({ saveNotes: notes }),
}));

export default useSaveNotes