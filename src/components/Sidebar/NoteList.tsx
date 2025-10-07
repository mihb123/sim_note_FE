import type { Note } from "@/types";
import { NoteItem } from "./NoteItem";

interface NoteListProps {
  notes: Note[];
  selectedNote: string | null;
  onSelectNote: (id: string) => void;
}

export const NoteList = ({ notes, selectedNote, onSelectNote }: NoteListProps) => (
  <div className="noteList overflow-y-auto flex flex-col px-4">
    {notes.map(note => (
      <NoteItem
        key={note.id}
        note={note}
        isSelected={selectedNote === note.id}
        onSelect={onSelectNote}
      />
    ))}
  </div>
);