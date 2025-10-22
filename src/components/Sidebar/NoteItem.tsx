import type { Note } from "@/types";
import {memo} from "react";
import useSelectNote from "@/hooks/useSelectNote";

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
}
export const NoteItem = memo(({ note, isSelected }: NoteItemProps) => {
  const selectNoteHandler = useSelectNote();
  const selectNote = () => {
    selectNoteHandler(note);
  };
  // log("Render NoteItem: ", note.id);
  
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