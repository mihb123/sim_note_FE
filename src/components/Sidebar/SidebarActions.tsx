import { DeleteNote, CreateNote, FetchNotes } from "@/api/note";
import { SquarePen, ArrowUpNarrowWide, Trash, RotateCw } from "lucide-react";
import useNotes from "@/hooks/useNotes";
import type { Note } from "@/types";
import useFocusNote from "@/hooks/useFocusNote";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/shallow";

export const SidebarActions = memo(() => {  
  const { focusNote, setFocusNote } = useFocusNote(useShallow(state => ({ focusNote: state.focusNote, setFocusNote: state.setFocusNote })));
  const { notes, deleteNoteFromStore, addNoteToStore, setNotes } = useNotes(
    useShallow(state => ({
      notes: state.notes,
      deleteNoteFromStore: state.deleteNoteFromStore,
      addNoteToStore: state.addNoteToStore,
      setNotes: state.setNotes,
    }))
  );

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
  },[focusNote, notes, deleteNoteFromStore, setFocusNote])

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
})
