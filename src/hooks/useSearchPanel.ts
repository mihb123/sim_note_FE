import { EditorView } from "codemirror";
import { StateEffect } from "@codemirror/state";
import { SearchQuery, setSearchQuery, findNext, findPrevious, closeSearchPanel } from "@codemirror/search";
import { useEffect, useState, useCallback } from "react";

export const toggleReplaceEffect = StateEffect.define<boolean>();

export function useSearchPanel(view: EditorView) {
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [regexp, setRegexp] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [showReplace, setShowReplace] = useState(false);

  useEffect(() => {
    if (!view) return;
    const query = new SearchQuery({ search, caseSensitive, regexp, wholeWord, replace });
    view.dispatch({ effects: setSearchQuery.of(query) });
  }, [search, replace, caseSensitive, regexp, wholeWord, view]);

  useEffect(() => {
    const extension = EditorView.updateListener.of((update) => {
      for (const tr of update.transactions) {
        for (const effect of tr.effects) {
          if (effect.is(toggleReplaceEffect)) setShowReplace(effect.value);
        }
      }
    });
    view.dispatch({ effects: StateEffect.appendConfig.of(extension) });
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.shiftKey ? findPrevious(view) : findNext(view);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearchPanel(view);
    }
  }, [view]);

  return {
    search, setSearch, replace, setReplace,
    caseSensitive, setCaseSensitive, regexp, setRegexp, wholeWord, setWholeWord,
    showReplace, handleSearchKeyDown, setShowReplace
  };
}