import { DeleteNote, CreateNote } from "@/api/note.api";
import { SquarePen, ArrowUpNarrowWide, Trash, RotateCw } from "lucide-react";
import useNotes from "@/hooks/useNotes";
import useFocusNote from "@/hooks/useFocusNote";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import useNotesData from "@/data/note.data";

export const SidebarActions = memo(() => {  
  const { focusNote, setFocusNote } = useFocusNote(useShallow(state => ({ focusNote: state.focusNote, setFocusNote: state.setFocusNote })));
  const { notes, deleteNoteFromStore, addNoteToStore } = useNotes(
    useShallow(state => ({
      notes: state.notes,
      deleteNoteFromStore: state.deleteNoteFromStore,
      addNoteToStore: state.addNoteToStore,
    }))
  );
  const { mutateNote } = useNotesData();

  const handleDelete = useCallback( async () => {
    if (!focusNote) return;
    const noteIdToDelete = focusNote.id;
    useNotes.getState().deleteNoteFromStore(noteIdToDelete);
    const newFocusId = useNotes.getState().notes[0]?.id || "";
    setFocusNote(newFocusId);

    try {
      DeleteNote(noteIdToDelete);
    } catch (error) {
      useNotes.getState().addNoteToStore(notes[noteIdToDelete]);
      setFocusNote(noteIdToDelete);
      mutateNote()
    }
  },[focusNote, notes, deleteNoteFromStore, setFocusNote])

  const handleCreate = useCallback(async () => {
    const tempId = `tmp-${Date.now()}`;
    const newNotePayload = { title: "Untitled", content: "", id: tempId, updated_at: new Date().toISOString()};
    addNoteToStore(newNotePayload)
    setFocusNote(tempId);
    
    try {
      const data = await CreateNote(newNotePayload);
      useNotes.getState().updateNote(data)
      setFocusNote(data.id)      
    } catch (e) {
      throw e
    } finally {
      useNotes.getState().deleteNoteFromStore(tempId);
    }
    mutateNote()
  }, [addNoteToStore, setFocusNote]);

  const onload = () => {
    mutateNote();
  }

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
