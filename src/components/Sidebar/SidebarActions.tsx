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
    const noteDelete = notes[noteIdToDelete];
    deleteNoteFromStore(noteIdToDelete);
    const newFocusId = notes[0]?.id || "";
    setFocusNote(newFocusId);

    DeleteNote(noteIdToDelete).catch((e) => {
      addNoteToStore(noteDelete);
      setFocusNote(noteIdToDelete);
      throw e;
    });  
  },[focusNote, notes, deleteNoteFromStore, setFocusNote])

  const handleCreate = useCallback(async () => {
    const tempId = `tmp-${Date.now()}`;
    const newNotePayload = { title: "Untitled", content: "", id: tempId, updated_at: new Date().toISOString()};
    addNoteToStore(newNotePayload)
    setFocusNote(tempId);
    
    CreateNote(newNotePayload).then((res) => {
      useNotes.getState().updateNote(res)
      setFocusNote(res.id);
    }).catch((e) => {
      throw e;
    }).finally(() => {
      deleteNoteFromStore(tempId);
    });
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
