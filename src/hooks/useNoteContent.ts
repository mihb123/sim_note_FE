import { useEffect, useState, useCallback } from "react";
import useNotes from '@/hooks/useNotes';
import { useEditor } from "@/hooks/useEditor";
import { saveNote } from "@/utils/note";
import useFocusNote from "@/hooks/useFocusNote";

const useNoteContent = () => {
  const updateNote = useNotes(state => state.updateNote);
  const focusNote = useFocusNote(state => state.focusNote);
  const [currentDoc, setCurrentDoc] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(focusNote?.is_save || false);
  const initialContent = focusNote ? `# ${focusNote.title}\n${focusNote.content}` : "";
  const { editorRef, info } = useEditor({ initialContent, setCurrentDoc });
  
  useEffect(() => {
    if (focusNote) {
      setIsSaved(focusNote.is_save);
      setCurrentDoc(initialContent);
    }
  }, [focusNote?.id]);

  const handleSave = useCallback((newIsSaved = isSaved ) => {
    if (currentDoc && focusNote) {
      saveNote({ text: currentDoc, focusNote, updateNote, isSaved:newIsSaved });
    }
  }, [currentDoc, focusNote, updateNote, isSaved]);

  return { editorRef, info, isSaved, setIsSaved, handleSave, currentDoc };
};

export default useNoteContent;