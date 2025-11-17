import { useRef, memo } from 'react';
import { EditorView } from 'codemirror';
import { findNext, findPrevious, selectMatches, replaceNext, replaceAll, closeSearchPanel } from '@codemirror/search';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { CaseSensitive, Regex, WholeWord, ArrowUp, ArrowDown, ListChecks, Replace, ReplaceAll, X, ChevronDown } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useSearchPanel } from '@/hooks/useSearchPanel';

interface SearchPanelProps {
  view: EditorView;
}

const SearchPanel = ({ view }: SearchPanelProps) => {
  const {
    search, setSearch, replace, setReplace,
    caseSensitive, setCaseSensitive, regexp, setRegexp, wholeWord, setWholeWord, setShowReplace,
    showReplace, handleSearchKeyDown
  } = useSearchPanel(view);

  const panelRef = useRef<HTMLDivElement>(null);

  const toggleOptions = [
    { state: caseSensitive, setter: setCaseSensitive, label: 'Match Case', Icon: CaseSensitive },
    { state: wholeWord, setter: setWholeWord, label: 'Match Whole Word', Icon: WholeWord },
    { state: regexp, setter: setRegexp, label: 'Use Regular Expression', Icon: Regex },
  ];

  return (
    <div ref={panelRef} className="search-panel p-2 flex flex-col gap-2">        
      <div className="flex items-center gap-3">        
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
            <ChevronDown className={`transition-transform ${showReplace ? 'rotate-180' : ''}`} onClick={() => setShowReplace(s => !s)} />
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
            <div className="h-4 w-8">
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SearchPanel);