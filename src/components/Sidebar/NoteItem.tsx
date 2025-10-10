import type { Note } from "@/types";
import { useNotes, type NoteStore } from "@/hooks/useNotes";
import React from "react";

interface NoteItemProps {
  note: Note;
}
const NoteItem = ({ note }: NoteItemProps) => { 
  const { focusNote, setFocusNote } = useNotes() as NoteStore;
  // log("Render NoteItem: ", note.id);
  const selectNote = () => {
    setFocusNote(note.id);    
  };
  const isSelected = focusNote?.id === note.id;
  
  return (
  <div
    onClick={selectNote}
    className={`noteItem pl-7 pr-3 mb-1 py-1 cursor-pointer rounded-md text-sidebar-text ${isSelected ? 'selected' : 'hover:bg-accent hover:text-sidebar-foreground'}`}
  >
    <div className="noteTitle">{note.title}</div>
  </div>
  );
};

export default React.memo(NoteItem);