import { PanelLeftOpen, EllipsisVertical } from "lucide-react";
import { useNotes, type NoteStore } from '@/hooks/useNotes';
import { useEffect, useRef, useState, useCallback } from "react";
import { useEditor } from "@/hooks/useEditor";
import { saveNote } from "@/utils/note";

export default function NoteContent() {
  const { focusNote, updateNote } = useNotes() as NoteStore;
  const [currentDoc, setCurrentDoc] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const initialContent = focusNote ? `# ${focusNote.title}\n${focusNote.content}` : "";
  const { editorRef, view, info } = useEditor({ initialContent, onDocChange: setCurrentDoc });

  useEffect(() => {
    if (view) {
      const currentEditorDoc = view.state.doc.toString();
      if (currentEditorDoc !== initialContent) {
        view.dispatch({
          changes: { from: 0, to: currentEditorDoc.length, insert: initialContent }
        });
      }
    }
  }, [focusNote, view]);

  const handleSave = useCallback(() => {
    if (currentDoc && focusNote) saveNote({ text: currentDoc, focusNote, updateNote });
  }, [currentDoc, focusNote, updateNote]);

  useEffect(() => {
    if (!currentDoc || !focusNote) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(handleSave, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); }
  }, [currentDoc, focusNote, handleSave]);
  
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="statusBar flex p-3 shrink-0">
        <div className="flex gap-4 ml-auto">
          <EllipsisVertical />
          <PanelLeftOpen />
        </div>
      </div>
      <div ref={editorRef} className="flex-1 overflow-y-auto pl-10 pr-4" id="sim_editor"></div>
      <div className="text-sm text-gray-500 p-2 ml-auto">
        {info.lines} lines | {info.words} words | {info.chars} chars
      </div>
    </div>
  );
}