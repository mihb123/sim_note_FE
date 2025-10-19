import useSWRInfinite from 'swr/infinite'
import { useShallow } from 'zustand/shallow'
import { FetchNotes } from '@/api/note.api'
import useNotes from '@/hooks/useNotes'
import config from '@/app.config'
import useSWR from 'swr'
import useSaveNotes from '@/hooks/useSaveNotes'

export default function useNotesData() {
  const setNotes = useNotes(useShallow(state => state.setNotes))
  const page_size = config.PAGE_SIZE;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.data.length === 0) return null
    return `/api/notes?page=${pageIndex + 1}&per_page=${page_size}`
  }

  const { data, size, setSize, mutate, isLoading, error } = useSWRInfinite(
    getKey,
    FetchNotes,
    {
      revalidateOnFocus: false,
      dedupingInterval: 500,
      onSuccess: (pages) => {
        const allNotes = pages.flatMap(p => Array.isArray(p) ? p : p.data )
        setNotes(allNotes)
      }
    }
  )
  const loadMore = () => setSize(size + 1)
  const lastPage = data?.[data.length - 1]
  const hasMore = Array.isArray(lastPage) ? lastPage : (lastPage?.data ?? [])
  
  return { isLoading, error, mutateNote: mutate, loadMore, hasMore: !!hasMore.length }
}

export function useSaveNotesData() {
  const key = '/api/notes?is_save=1';
  const { data, mutate, error, isLoading } = useSWR(key, FetchNotes, {
    revalidateOnFocus: false,
    dedupingInterval: 500,
    onSuccess: (notes) => {
      if (Array.isArray(notes)) useSaveNotes.getState().setSaveNotes(notes)
    }
  }) 
  
  return { saveNotes: data, mutateSaveNote: mutate, error, isLoading }
}

export function useSearchNoteData({ keyword }: { keyword: string }) {
  const key = keyword ? `/api/notes?search=${keyword}` : null;
  const { data, error, isLoading } = useSWR(key, FetchNotes, {
    revalidateOnFocus: false,
    dedupingInterval: 500
  })

  return { searchNotes: data, error, isLoading }  
}