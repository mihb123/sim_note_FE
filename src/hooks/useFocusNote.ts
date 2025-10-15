import type { Note } from "@/types";
import { create } from 'zustand';
import useNotes from '@/hooks/useNotes';
import useSaveNotes from "./useSaveNotes";

interface FocusNoteStore {
  focusNote: Note | null;
  setFocusNote: (id: string) => void;
}

const useFocusNote = create<FocusNoteStore>((set) => ({
  focusNote: null,
  setFocusNote: (id) => {
    const notes = useNotes.getState().notes;
    const saveNotes = useSaveNotes.getState().saveNotes;
    const focusNote = notes[id] || saveNotes.find(note => note.id == id);
    localStorage.setItem("focusNoteId", id);
    set({ focusNote: focusNote});
  },
}));

export default useFocusNote;