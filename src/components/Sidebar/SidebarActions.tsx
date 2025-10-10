import { DeleteNote, CreateNote, FetchNotes } from "@/api/note";
import { SquarePen, ArrowUpNarrowWide, Trash, RotateCw } from "lucide-react";
import { useNotes, type NoteStore } from "@/hooks/useNotes";
import type { Note } from "@/types";

export const SidebarActions = () => {
  const { notes, focusNote, setFocusNote, DeleteNoteFromStore, AddNoteToStore, setNotes } = useNotes() as NoteStore;

  const handleDelete = async () => {
    if (!focusNote) return;
    const noteIdToDelete = focusNote.id;

    DeleteNote(noteIdToDelete);
    const remainingNotes = Object.values(notes).filter(
      (note) => note.id !== noteIdToDelete
    );
    const sortedNotes = remainingNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    const newFocusNoteId = sortedNotes.length > 0 ? sortedNotes[0].id : "";

    DeleteNoteFromStore(noteIdToDelete);
    setFocusNote(newFocusNoteId);
  };

  const handleCreate = async () => {
    const newNotePayload = { title: "Untitled", content: "" };
    const createdNote = await CreateNote(newNotePayload);
    AddNoteToStore(createdNote);
    setFocusNote(createdNote.id);
    localStorage.setItem("focusNoteId", createdNote.id);    
  };

  const onload = () => {
    FetchNotes().then(fetchedNotes => {
      const notesMap: { [key: string]: Note } = {};
      fetchedNotes.forEach(note => { notesMap[note.id] = note; });
      setNotes(notesMap);
    });
  };


  return (
    <div className="flex justify-center p-3">
      <div className="flex gap-4">
        <SquarePen onClick={handleCreate} />
        <ArrowUpNarrowWide />
        <RotateCw onClick={() => onload()}/>
        <Trash onClick={handleDelete} />
      </div>
    </div>
  );
};
