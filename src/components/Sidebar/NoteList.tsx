import type { Note, NotesMap } from "@/types";
import { NoteItem } from "./NoteItem";
import { memo, useEffect, useMemo, useRef } from "react";
import useNotes from '@/hooks/useNotes';
import { FetchNotes } from "@/api/note";
import { useShallow } from "zustand/shallow";
import useFocusNote from "@/hooks/useFocusNote";

export const NoteList = memo(() => {
  const { notes, setNotes } = useNotes(useShallow(state => ({ notes: state.notes, setNotes: state.setNotes })));
  const { focusNote, setFocusNote } = useFocusNote(useShallow(state => ({ focusNote: state.focusNote, setFocusNote: state.setFocusNote })));

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

  const noteKB = JSON.stringify(notes).length / 1024 / 1024;
  log("Render NoteList & Volumn of notes is " + (noteKB).toFixed(2) + "MB")

  useEffect(() => {    
    if (noteListRef.current) {
      const selectedNote = noteListRef.current?.querySelector(".selected"); 
      if (selectedNote) {
        selectedNote.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [sortedNotes]);

  return (
    <div ref={noteListRef} className="noteList flex-1 overflow-y-auto flex flex-col px-4 mr-2">
      {sortedNotes.map(note => <NoteItem key={note.id} note={note} isSelected={note.id === focusNote?.id} />)}
    </div>
  );
})