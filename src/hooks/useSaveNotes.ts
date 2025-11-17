import type { NoteMetaData } from '@/types';
import { create } from 'zustand';

interface SaveNoteStore{
  saveNotes: NoteMetaData[];
  setSaveNotes: (notes: NoteMetaData[]) => void;
}

const useSaveNotes = create<SaveNoteStore>((set) => ({
  saveNotes: [],
  setSaveNotes: (notes) => set({ saveNotes: notes }),
}));

export default useSaveNotes