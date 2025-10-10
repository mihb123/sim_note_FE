import type { Note } from "@/types";
import { create } from 'zustand';
import { useNotes } from '@/hooks/useNotes';

export interface FocusNoteStore {
  focusNote: Note | null;
  setFocusNote: (id: string) => void;
}

export const useFocusNote = create<FocusNoteStore>((set) => ({
  focusNote: null,
  setFocusNote: (id) => {
    const notes = useNotes.getState().notes;
    localStorage.setItem("focusNoteId", id);
    set({ focusNote: notes[id] || null });
  },
}));