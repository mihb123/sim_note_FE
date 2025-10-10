import type { Note, NotesMap } from "@/types";
import { NoteItem } from "./NoteItem";
import { useEffect, useMemo, useRef } from "react";
import { useNotes } from '@/hooks/useNotes';
import { FetchNotes } from "@/api/note";
import { useFocusNote } from "@/hooks/useFocusNote";

export const NoteList = () => {
  const notes = useNotes((state) => state.notes);
  const setNotes = useNotes((state) => state.setNotes);
  const focusNote = useFocusNote((state) => state.focusNote);
  const setFocusNote = useFocusNote((state) => state.setFocusNote);

  const noteListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotes = async () => {
      const data = await FetchNotes();
      const notesMap: NotesMap = Object.fromEntries(data.map((n: Note) => [n.id, n]));
      setNotes(notesMap);
      const savedNoteId = localStorage.getItem("focusNoteId") || Object.values(notesMap)[0]?.id;
      if (savedNoteId) setFocusNote(savedNoteId);
    };

    loadNotes();

  }, [setNotes, setFocusNote]);

  const sortedNotes = useMemo(() => {
    return Object.values(notes).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [notes]);

  useEffect(() => {    
    if (noteListRef.current) {
      const selectedNote = noteListRef.current?.querySelector(".selected"); 
      if (selectedNote) {
        selectedNote.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [sortedNotes]);

  return (
    <div ref={noteListRef} className="noteList flex-1 overflow-y-auto flex flex-col px-4">
      {sortedNotes.map(note => <NoteItem key={note.id} note={note} isSelected={note.id === focusNote?.id} />)}
    </div>
  );
};