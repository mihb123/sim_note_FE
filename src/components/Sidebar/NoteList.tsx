import type { Note, NotesMap } from "@/types";
import { NoteItem } from "./NoteItem";
import { useEffect, useMemo } from "react";
import { useNotes } from '@/hooks/useNotes';
import { FetchNotes } from "@/api/note";

export const NoteList = () => {
  const { notes, setNotes, setFocusNote } = useNotes() as {
    notes: NotesMap;
    setNotes: (notes: NotesMap) => void;
    setFocusNote: (id: string) => void;
  };

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notesData = await FetchNotes();
        const NotesMap = notesData.reduce((acc: NotesMap, note: Note) => {
          acc[note.id] = note;
          return acc;
        }, {});
        setNotes(NotesMap);
        const firstNote = Object.values(NotesMap)[0];
        const savedNoteId = localStorage.getItem("focusNoteId") ? localStorage.getItem("focusNoteId") : firstNote?.id;
        if (savedNoteId && NotesMap[savedNoteId]) {
          setFocusNote(savedNoteId);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    loadNotes();
  }, [setNotes]);
  const sortedNotes = useMemo(() => {
    return Object.values(notes).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [notes]);
  return (
    <div className="noteList flex-1 overflow-y-auto flex flex-col px-4">
      {sortedNotes.map(note => <NoteItem key={note.id} note={note} />)}
    </div>
  );
};