import useFocusNote from "@/hooks/useFocusNote";
import type { Note } from "@/types";
import { useShallow } from "zustand/shallow";
import {memo, useCallback} from "react";

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
}
export const NoteItem = memo(({ note, isSelected }: NoteItemProps) => {
  const setFocusNote = useFocusNote(useShallow((state) => state.setFocusNote));
  const selectNote = useCallback(() => setFocusNote(note.id), [setFocusNote, note]);
  log("Render NoteItem: ", note.id);  
  
  return (
  <div
    onClick={selectNote} 
      className={`noteItem pl-4 pr-3 mb-1 py-1 cursor-pointer rounded-md text-sidebar-text ${isSelected ? 'selected' : 'hover:bg-accent hover:text-sidebar-foreground'}`}
      data-note-id={note.id}    
    >
    <div className="noteTitle truncate w-full">{note.title}</div>
  </div>
  );
});