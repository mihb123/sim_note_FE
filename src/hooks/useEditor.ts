import { useEffect, useState, useRef, createElement } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { search, searchKeymap, searchPanelOpen, openSearchPanel } from "@codemirror/search";
import { keymap, type Panel } from "@codemirror/view"
import { createRoot } from "react-dom/client";
import SearchPanel from "@/components/SearchPanel";
import { toggleReplaceEffect } from "@/hooks/useSearchPanel";
import useFocusNote from "@/hooks/useFocusNote";

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
  const setEditorView = useFocusNote(state => state.setEditorView);
  const view = useFocusNote(state => state.view);
  const [info, setInfo] = useState<EditorInfo>({ words: 0, lines: 0, chars: 0 });
  const onDocChangeRef = useRef(onDocChange);

  // keep latest callback reference without triggering effect
  useEffect(() => {
    onDocChangeRef.current = onDocChange;
  }, [onDocChange]);

  const updateInfo = (text: string) => {
    setInfo({
      lines: text.split("\n").length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      chars: text.length,
    });
  };

  useEffect(() => {
    if (!editorRef.current || view) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const text = update.state.doc.toString();
        onDocChangeRef.current(text);
        updateInfo(text);
      }
    });

    const mySearchPanel = (view: EditorView): Panel => {
      const dom = document.createElement("div");
      dom.className = "cm-search-custom";
      dom.setAttribute("main-field", "true");
      const root = createRoot(dom);
      root.render(createElement(SearchPanel, { view }));

      return {
        dom,
        top: true,
        destroy: () => root.unmount(),
      };
    }

    const openReplace = (view: EditorView) => {
      if (!searchPanelOpen(view.state)) openSearchPanel(view);
      setTimeout(() => {
        view.dispatch({ effects: toggleReplaceEffect.of(true) });
      }, 0);
      return true;
    }

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        search({ createPanel: mySearchPanel }),
        basicSetup,
        updateListener,
        EditorView.lineWrapping,
        keymap.of([...searchKeymap,
        {
          key: "Mod-h",
          run: openReplace
        },
        ]),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
      ],
    });

    const editorView = new EditorView({
      state,
      parent: editorRef.current,
    });

    setEditorView(editorView);
    console.log("Editor initialized")
    return () => {
      editorView.destroy();
      setEditorView(null);
    };
  }, []);

  return { editorRef, view, info, updateInfo };
};
