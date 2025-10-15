import { useEffect, useRef, useState, useCallback } from "react";
import { useShallow } from 'zustand/shallow';
import useNotes from '@/hooks/useNotes';
import { useEditor } from "@/hooks/useEditor";
import { saveNote } from "@/utils/note";
import useFocusNote from "@/hooks/useFocusNote";
import useDebounce from "./useDebounce";

const useNoteContent = () => {
  // 1. Select state from stores using useShallow for optimization
  const updateNote = useNotes(useShallow(state => state.updateNote));
  const focusNote = useFocusNote(useShallow(state => state.focusNote));
  const prevFocusNoteId = useRef<string | null>(null);

  // 2. Editor and content state
  const [currentDoc, setCurrentDoc] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(focusNote?.is_save || false);
  const initialContent = focusNote ? `# ${focusNote.title}\n${focusNote.content}` : "";
  const { editorRef, view, info, updateInfo } = useEditor({ initialContent, onDocChange: setCurrentDoc });

  // 3. Effect to update editor when focusNote changes
  useEffect(() => {
    if (view && focusNote) {
      if (prevFocusNoteId.current != focusNote.id) {
        const newContent = `# ${focusNote.title}\n${focusNote.content}`;
        const currentEditorDoc = view.state.doc.toString();
        if (currentEditorDoc !== newContent) {
          view.dispatch({
            changes: { from: 0, to: currentEditorDoc.length, insert: newContent }
          });
        }
        setIsSaved(focusNote.is_save);
        updateInfo(initialContent);
        setCurrentDoc(initialContent);
      }
      prevFocusNoteId.current = focusNote.id;
    }
  }, [focusNote, view, updateInfo]);

  // 4. Debounced save logic
  const handleSave = useCallback((newIsSaved = isSaved ) => {
    if (currentDoc && focusNote) {
      saveNote({ text: currentDoc, focusNote, updateNote, isSaved:newIsSaved });
    }
  }, [currentDoc, focusNote, updateNote, isSaved]);

  useDebounce(() => {
    if (currentDoc && focusNote && currentDoc !== initialContent) {
      handleSave();
    }
  }, [currentDoc, focusNote], 500);

  return { editorRef, info, isSaved, setIsSaved, handleSave};
};

export default useNoteContent;