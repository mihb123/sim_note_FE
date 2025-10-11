import { useEffect, useRef, useState, useCallback } from "react";
import { useShallow } from 'zustand/shallow';
import useNotes from '@/hooks/useNotes';
import { useEditor } from "@/hooks/useEditor";
import { saveNote } from "@/utils/note";
import useFocusNote from "@/hooks/useFocusNote";

const useNoteContent = () => {
  // 1. Select state from stores using useShallow for optimization
  const updateNote = useNotes(useShallow(state => state.updateNote));
  const focusNote = useFocusNote(useShallow(state => state.focusNote));
  const prevFocusNoteId = useRef<string | null>(null);

  // 2. Editor and content state
  const [currentDoc, setCurrentDoc] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
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
        updateInfo(initialContent);
        setCurrentDoc(initialContent);
      }
      prevFocusNoteId.current = focusNote.id;
    }
  }, [focusNote, view, updateInfo]);

  // 4. Debounced save logic
  const handleSave = useCallback(() => {
    if (currentDoc && focusNote) {
      saveNote({ text: currentDoc, focusNote, updateNote });
    }
  }, [currentDoc, focusNote, updateNote]);

  useEffect(() => {
    if (!currentDoc || !focusNote) return;
    if (currentDoc === initialContent) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(handleSave, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [currentDoc, focusNote, handleSave, initialContent]);

  return {
    editorRef,
    info
  };
};

export default useNoteContent;