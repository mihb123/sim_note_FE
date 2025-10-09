import type { Note } from "@/types";
import { useNotes, type NoteStore } from "@/hooks/useNotes";

interface NoteItemProps {
  note: Note;
}

export const NoteItem = ({ note }: NoteItemProps) => { 
  const { focusNote, setFocusNote } = useNotes() as NoteStore;

  const selectNote = () => {
    setFocusNote(note.id);    
    localStorage.setItem("focusNoteId", note.id);
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