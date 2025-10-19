import { useRef, useState } from "react";
import { toast } from "sonner"
import { Loader2Icon, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IconCircleX } from "@/components/Icon";
import { useDebounceFn } from "ahooks";
import { useSearchNoteData } from "@/data/note.data";
import { ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import useFocusNote from "@/hooks/useFocusNote";
import { useShallow } from "zustand/shallow";
export default function SearchFrom() {
  const formRef = useRef<HTMLFormElement>(null);
  const [searchVal, setSearchVal] = useState<string>('');
  const { searchNotes, isLoading } = useSearchNoteData({ keyword: searchVal });
  const setFocusNote = useFocusNote(useShallow(state => state.setFocusNote));

  const { run: handleSearch } = useDebounceFn(async () => {
    const value = formRef.current?.querySelector('input')?.value || '';
    const iconX = formRef.current?.querySelector('.iconX')
    if (value) {
      iconX?.classList.remove('hidden')
      setSearchVal(value)
    }
    toast.info("Search value is: ", {
      description: value,
    })
  }, { wait: 300 })

  const handleClear = () => {
    const input = formRef.current?.querySelector('input')
    if (!input) return;
    input.value = '';
    setSearchVal('')
    formRef.current?.querySelector('.iconX')?.classList.add('hidden')
  }

  function highlightJSX(text: string, keyword: string) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ?
        (<span key={i} className="bg-yellow-200 dark:bg-yellow-400 dark:text-gray-800 rounded px-1">
        {part}
        </span>) :
        (<span key={i}>{part}</span>)
    );
  }

  const handleSelect = (id: string) => { setFocusNote(id) }

  return (
    <div className="body flex flex-col min-h-0 p-3 flex-1">
      <form id="search" ref={formRef} onChange={handleSearch}>
        <InputGroup>
          <InputGroupInput placeholder="Search..." autoFocus />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon className="iconX hidden" align="inline-end" onClick={handleClear}><IconCircleX /></InputGroupAddon>
        </InputGroup>
      </form>
      {isLoading && <div className="flex justify-center mt-4"><Loader2Icon className="size-4 animate-spin" /></div>
      }

      {(Array.isArray(searchNotes) && !!searchNotes) && <div className="p-2 pl-0">
        <span className="text-sm dark:text-gray-500 text-gray-400">{searchNotes?.length} results</span>
      </div>
      }

      <div className="search_result overflow-y-auto flex-1 pr-1">
        {Array.isArray(searchNotes) && searchNotes?.map(note => (
          <ItemContent key={note.id} className="mb-2">
            <ItemTitle className="pb-1 flex w-full hover:cursor-pointer" onClick={handleSelect.bind(null, note.id)}>
              <span className="dark:text-gray-400 text-gray-600">
                {highlightJSX(note.title, searchVal)}
              </span>
              <span className="ml-auto dark:text-gray-500 text-gray-400 pr-1">2</span>
            </ItemTitle>
            <ItemDescription className="rounded p-1 pl-2 bg-gray-100 dark:bg-background line-clamp-4 hover:cursor-pointer" onClick={handleSelect.bind(null, note.id)}>
              {highlightJSX(note.content, searchVal)}
            </ItemDescription>
          </ItemContent>
        ))}
      </div>
    </div>
  )
}