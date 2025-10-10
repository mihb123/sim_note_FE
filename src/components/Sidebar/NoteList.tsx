import type { Note, NotesMap } from "@/types";
import { NoteItem } from "./NoteItem";
import { useEffect, useMemo, useRef } from "react";
import { useNotes, type NoteStore } from '@/hooks/useNotes';
import { FetchNotes } from "@/api/note";

export const NoteList = () => {
  const { notes, setNotes, setFocusNote } = useNotes() as NoteStore;
  const noteListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotes = async () => {
      const notesMap: NotesMap = {};
      await FetchNotes().then(data => data.forEach((note: Note) => { notesMap[note.id] = note; }));
      setNotes(notesMap);
      const savedNoteId = localStorage.getItem("focusNoteId") || Object.values(notesMap)[0]?.id;
      savedNoteId && setFocusNote(savedNoteId);
    };

    loadNotes();

  }, [setNotes]);

  const sortedNotes = useMemo(() => {
    return Object.values(notes).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [notes]);

  useEffect(() => {    
    if (noteListRef.current) {
      const selectedNote = noteListRef.current.querySelector(".selected"); 
      if (selectedNote) {
        selectedNote.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [sortedNotes]);

  const notesSizeKB = JSON.stringify(notes).length / 1024;
  log("Convert size note to MB: ", (notesSizeKB / 1024).toFixed(2), "MB");

  return (
    <div ref={noteListRef} className="noteList flex-1 overflow-y-auto flex flex-col px-4">
      {sortedNotes.map(note => <NoteItem key={note.id} note={note} />)}
    </div>
  );
};