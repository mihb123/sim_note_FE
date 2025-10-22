import useFocusNote from "@/hooks/useFocusNote";
import { memo, useCallback, useMemo, useRef } from "react";
import highlightJSX from "./Highlight";
import { ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import type { Note } from "@/types";
import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';

interface SearchResultItemProps {
  note: Note;
  searchVal: string;
}

interface lines {
  texts: { text: string; from: number }[];
  index: number;
}

const SearchItem = ({ note, searchVal }: SearchResultItemProps) => {
  const setFocusNote = useFocusNote(state => state.setFocusNote);
  const lastPosRef = useRef<number | null>(null);

  const handleSelect = useCallback((id: string, lineIndex?: number, from?: number) => {
    setFocusNote(id);    
    setTimeout(() => {
      if (lineIndex === undefined || from === undefined) return;
      const newView = useFocusNote.getState().view;

      if (!newView) return;

      const line = newView.state.doc.line(lineIndex + 1);
      const absolutePos = line.from + from;
      if (!newView.hasFocus) newView.focus();
      if (lastPosRef.current !== absolutePos) {
        lastPosRef.current = absolutePos;
        const endPos = absolutePos + (searchVal?.length || 0);
        
        newView.dispatch({
          selection: EditorSelection.range(absolutePos, endPos),
          effects: [EditorView.scrollIntoView(absolutePos)]
        });
      }
    }, 0);
  }, [setFocusNote]);

  const { _hTitle, matchLines } = useMemo(() => {
    const _hTitle = highlightJSX(note.title, searchVal);
    if (!searchVal) return { _hTitle, matchLines: [] };

    const addMore = 10;
    const max = 100;
    const escapedSearchVal = searchVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearchVal, 'gi');

    const matchLines = note.content.split('\n').reduce((acc: lines[], line, index) => {
      const matches = [...line.matchAll(searchRegex)].map(match => match.index as number);
      if (matches.length === 0) return acc;

      const texts: { text: string; from: number }[] = [];
      let i = 0;
      while (i < matches.length) {
        let j = i;
        while (j + 1 < matches.length && matches[j + 1] - matches[j] < max) {
          j++;
        }

        const from = Math.max(0, matches[i] - addMore);
        const to = Math.min(line.length, matches[j] + searchVal.length + addMore);
        let output = line.slice(from, to);
        if(from != 0) output = "..." + output;
        if (to != line.length) output += "...";
        texts.push({ text: output, from: matches[i] });
        i = j + 1;
      }

      acc.push({
        texts,
        index: index+1,
      });
      return acc;
    }, []);

    return { _hTitle, matchLines };
  }, [note.content, note.title, searchVal]);

  return (
    <ItemContent className="mb-3">
      <ItemTitle className="pb-1 flex w-full hover:cursor-pointer" onClick={() => handleSelect(note.id)}>
        <span className="dark:text-gray-400 text-gray-600">{_hTitle}</span>
        <span className="ml-auto dark:text-gray-500 text-gray-400 pr-1">{matchLines.length > 1 && matchLines.length }</span>
      </ItemTitle>
      {matchLines.flatMap((line) =>        
        line.texts.map((text, index) => {
          const _hText = highlightJSX(text.text, searchVal);
          return (
            <ItemDescription key={`${line.index}-${index}`} className="rounded p-1 pl-2 bg-gray-100 dark:bg-background line-clamp-4 hover:cursor-pointer" onClick={() => handleSelect(note.id, line.index, text.from)}>{_hText}</ItemDescription>
          );
        })
      )}
    </ItemContent>
  );
};

export default memo(SearchItem);