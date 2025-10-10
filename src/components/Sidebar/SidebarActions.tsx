import { DeleteNote, CreateNote, FetchNotes } from "@/api/note";
import { SquarePen, ArrowUpNarrowWide, Trash, RotateCw } from "lucide-react";
import { useNotes, type NoteStore } from "@/hooks/useNotes";
import type { Note } from "@/types";
import { type FocusNoteStore, useFocusNote } from "@/hooks/useFocusNote";
import { useCallback } from "react";

export const SidebarActions = () => {
  const { deleteNoteFromStore, addNoteToStore, setNotes } = useNotes() as NoteStore;
  const notes = useNotes((state) => state.notes)
  const { focusNote, setFocusNote } = useFocusNote() as FocusNoteStore;

  const handleDelete = useCallback( async () => {
    if (!focusNote) return;
    const noteIdToDelete = focusNote.id;

    DeleteNote(noteIdToDelete);
    const remainingNotes = Object.values(notes).filter(
      (note) => note.id !== noteIdToDelete
    );
    const sortedNotes = remainingNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    const newFocusNoteId = sortedNotes.length > 0 ? sortedNotes[0].id : "";

    deleteNoteFromStore(noteIdToDelete);
    setFocusNote(newFocusNoteId);
  },[focusNote, deleteNoteFromStore, setFocusNote])

  const handleCreate = useCallback(async () => {
    const newNotePayload = { title: "Untitled", content: "" };
    const createdNote = await CreateNote(newNotePayload);
    addNoteToStore(createdNote);
    setFocusNote(createdNote.id);
    localStorage.setItem("focusNoteId", createdNote.id);    
  }, [addNoteToStore, setFocusNote]);

  const onload = useCallback(() => {
    () => {
      FetchNotes().then(fetchedNotes => {
        const notesMap: { [key: string]: Note } = {};
        fetchedNotes.forEach(note => { notesMap[note.id] = note; });
        setNotes(notesMap);
      });
    }
  }, [setNotes]);

  return (
    <div className="flex justify-center p-3">
      <div className="flex gap-4">
        <SquarePen onClick={handleCreate} />
        <ArrowUpNarrowWide />
        <RotateCw onClick={onload}/>
        <Trash onClick={handleDelete} />
      </div>
    </div>
  );
};
