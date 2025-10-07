import type { Note } from "@/types";

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const NoteItem = ({ note, isSelected, onSelect }: NoteItemProps) => (
  <div
    onClick={() => onSelect(note.id)}
    className={`noteItem pl-7 pr-3 mb-1 py-1 cursor-pointer rounded-md text-sidebar-text ${isSelected ? 'selected' : 'hover:bg-accent hover:text-sidebar-foreground transition-colors'}`}
  >
    <div className="noteTitle">{note.title}</div>
  </div>
);