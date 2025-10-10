import { useFocusNote } from "@/hooks/useFocusNote";
import type { Note } from "@/types";
import {memo, useCallback} from "react";

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
}
export const NoteItem = memo(({ note, isSelected }: NoteItemProps) => {
  const setFocusNote = useFocusNote((state) => state.setFocusNote);
  const selectNote = useCallback(() => setFocusNote(note.id), [setFocusNote, note.id]);
  log("Render NoteItem: ", note.id);  
  
  return (
  <div
    onClick={selectNote} 
    className={`noteItem pl-7 pr-3 mb-1 py-1 cursor-pointer rounded-md text-sidebar-text ${isSelected ? 'selected' : 'hover:bg-accent hover:text-sidebar-foreground'}`}
    >
    <div className="noteTitle">{note.title}</div>
  </div>
  );
});