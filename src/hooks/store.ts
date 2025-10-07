import { create } from "zustand";

export const useSelectedNote = create((set) => ({
  selectedNote: null,
  setSelectedNote: (noteId: string | null) => set({ selectedNote: noteId }),
}));
