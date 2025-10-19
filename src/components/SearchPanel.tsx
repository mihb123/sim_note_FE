import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { EditorView } from 'codemirror';
import { StateEffect } from '@codemirror/state';
import { SearchQuery, setSearchQuery, findNext, findPrevious, selectMatches, replaceNext, replaceAll, closeSearchPanel } from '@codemirror/search';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { CaseSensitive, Regex, WholeWord, SearchIcon, ArrowUp, ArrowDown, ListChecks, Replace, ReplaceAll, X } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

interface SearchPanelProps {
  view: EditorView;
}

export const toggleReplaceEffect = StateEffect.define<boolean>();

const SearchPanel = ({ view }: SearchPanelProps) => {
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [regexp, setRegexp] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [showReplace, setShowReplace] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const query = new SearchQuery({ search, caseSensitive, regexp, wholeWord, replace });
    view.dispatch({ effects: setSearchQuery.of(query) });
  }, [search, replace, caseSensitive, regexp, wholeWord, view]);

  useEffect(() => {
    // This effect listener will react to the keymap dispatch from useEditor.ts
    const extension = EditorView.updateListener.of((update) => {
      for (const tr of update.transactions) {
        for (const effect of tr.effects) {
          if (effect.is(toggleReplaceEffect)) setShowReplace(effect.value);
        }
      }
    });
    view.dispatch({ effects: StateEffect.appendConfig.of(extension) });
  }, []);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.shiftKey ? findPrevious(view) : findNext(view);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeSearchPanel(view);
      }
    },
    [view]
  );

  const toggleOptions = [
    { state: caseSensitive, setter: setCaseSensitive, label: 'Match Case', Icon: CaseSensitive },
    { state: wholeWord, setter: setWholeWord, label: 'Match Whole Word', Icon: WholeWord },
    { state: regexp, setter: setRegexp, label: 'Use Regular Expression', Icon: Regex },
  ];

  return (
    <div ref={panelRef} className=" search-panel p-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput type="text"
            autoFocus
            placeholder="Find"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="h-8"
            aria-label="Find" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="gap-0.5">
            {toggleOptions.map(({ state, setter, label, Icon }) => (
              <Toggle
                className="rounded-sm hover:cursor-pointer"
                key={label}
                size="sm"
                pressed={state}
                onPressedChange={setter}
                aria-label={label}
                title={label}
              ><Icon /></Toggle>
            ))}
          </InputGroupAddon>
        </InputGroup>
        <div className="flex flex-row gap-2">
          <ArrowUp onClick={() => findPrevious(view)} />
          <ArrowDown onClick={() => findNext(view)} />
          <ListChecks onClick={() => selectMatches(view)}  />
          <X onClick={() => closeSearchPanel(view)} />  
        </div>
                
      </div>

      {showReplace && (
        <div className="flex items-center gap-2">
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="Replace"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              className="h-8"
              aria-label="Replace"
            />
          </InputGroup>
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" onClick={() => replaceNext(view)} title="Replace" className="hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
              <Replace className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => replaceAll(view)} title="Replace All" className="hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
              <ReplaceAll className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SearchPanel);