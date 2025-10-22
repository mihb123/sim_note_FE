import useNotes from "@/hooks/useNotes";
import useFocusNote from "./useFocusNote";
import type { Note } from "@/types";
import { useCallback } from "react";

export default function useSelectNote() {
  const setFocusNote = useFocusNote((state) => state.setFocusNote);
  const addNoteToStore = useNotes((state) => state.addNoteToStore);
  const notes = useNotes((state) => state.notes);

  return useCallback((note: Note) => {
    if (!notes[note.id]) {
      addNoteToStore(note);
    }
    setFocusNote(note.id);
  }, [notes, addNoteToStore, setFocusNote]);
}