import { useRef, useState, useMemo, useCallback } from "react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IconCircleX } from "@/components/ui/Icon";
import { useDebounceFn } from "ahooks";
import { useSearchNoteData } from "@/data/note.data";
import { NoteItemSkeleton } from "@/components/Sidebar/NoteItemSkeleton";
import SearchItem from "@/components/Sidebar/SearchTab/SearchItem";
import config from "@/app.config";

export default function SearchTab() {
  const searchRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const isEndRef = useRef(isEnd);
  const [searchVal, setSearchVal] = useState('');
  const [keyword, setKeyword] = useState('');
  
  const { searchNotes, isLoading } = useSearchNoteData(keyword);

  const { run: debouncedSearch } = useDebounceFn((value: string) => {
    setKeyword(value.trim());  
  }, { wait: 200 });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchVal(value);
    debouncedSearch(value); 
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setSearchVal('');
    setKeyword('');
  }, []);
  const items = config.PAGE_SIZE;
  
  const visibleNotes = useMemo(() => {
    if (!Array.isArray(searchNotes)) return [];
    if (searchNotes.length <= items * size) {
      setIsEnd(true);
      return searchNotes;
    }

    return searchNotes.slice(0, items * size);
  }, [searchNotes, size, items]);

  const handleScroll = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    return () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        const el = searchRef.current;
        const notLoad = !el || isEndRef.current;

        if (!notLoad &&el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
          setSize(size => size + 1);
        }
      }, 100);    
    }    
  }, []);

  const isShowLoading = !isEnd && visibleNotes.length > 0;
  
  return (
    <div className="body flex flex-col min-h-0 p-3 flex-1">
      <div>
        <InputGroup>
          <InputGroupInput placeholder="Search..." autoFocus value={searchVal} onChange={handleChange} />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon className="iconX" align="inline-end" onClick={handleClear} hidden={!searchVal}><IconCircleX /></InputGroupAddon>
        </InputGroup>
      </div>

      {isLoading && <div className="flex justify-center mt-4"><Loader2Icon className="size-4 animate-spin" /></div>}

      {(Array.isArray(searchNotes) && !!searchNotes) && <div className="p-2 pl-0">
        <span className="text-sm dark:text-gray-500 text-gray-400">{searchNotes.length} results</span>
      </div>}

      <div ref={searchRef} className="search_result overflow-y-auto flex-1 pr-1" onScroll={handleScroll}>
        {visibleNotes.map(note => (
          <SearchItem key={note.id} note={note} searchVal={searchVal} />
        ))}
        {isShowLoading && (
          <div>
            {Array.from({ length: 2 }).map((_, index) => <NoteItemSkeleton key={index} />)}
          </div>
        )}
      </div>
    </div>
  );
}
