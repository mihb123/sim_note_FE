import { useEffect, useState, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export interface EditorInfo {
  words: number;
  lines: number;
  chars: number;
}

interface UseEditorProps {
  initialContent: string;
  onDocChange: (doc: string) => void;
}

export const useEditor = ({ initialContent, onDocChange }: UseEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView | null>(null);
  const [info, setInfo] = useState<EditorInfo>({ words: 0, lines: 0, chars: 0 });

  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const text = update.state.doc.toString();
        onDocChange(text);

        const lines = text.split("\n").length;
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const chars = text.length;
        setInfo({ lines, words, chars });
      }
    });

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        basicSetup,
        updateListener,
        EditorView.lineWrapping,
        markdown({ base: markdownLanguage, codeLanguages: languages }),
      ],
    });

    const editorView = new EditorView({
      state,
      parent: editorRef.current,
    });

    setView(editorView);

    return () => {
      editorView.destroy();
      setView(null);
    };
  }, []);

  return { editorRef, view, info };
};