import type { NoteMetaData } from '@/types';
import { create } from 'zustand';

interface SharedNoteStore {
  sharedNotes: NoteMetaData[];
  setSharedNotes: (notes: NoteMetaData[]) => void;
}

const useSharedNotes = create<SharedNoteStore>((set) => ({
  sharedNotes: [],
  setSharedNotes: (notes) => set({ sharedNotes: notes }),
}));

export default useSharedNotes