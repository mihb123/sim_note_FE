import type { Note } from "@/types";
import { create } from 'zustand';
import useNotes from '@/hooks/useNotes';
import useSaveNotes from "./useSaveNotes";
import { EditorView } from 'codemirror';

interface FocusNoteStore {
  focusNote: Note | null;
  setFocusNote: (id: string) => void;
  view: EditorView | null;
  setEditorView: (view: EditorView | null) => void;
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
  view: null,
  setEditorView: (view) => set({ view: view }),
}));

export default useFocusNote;