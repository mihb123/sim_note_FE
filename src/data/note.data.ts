import useSWRInfinite from 'swr/infinite'
import { FetchNoteId, FetchNotes } from '@/api/note.api'
import useNotes from '@/hooks/useNotes'
import config from '@/app.config'
import useSWR from 'swr'
import useSaveNotes from '@/hooks/useSaveNotes'

export default function useNotesData() {
  const page_size = config.PAGE_SIZE;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.data.length === 0) return null
    return `/api/notes?page=${pageIndex + 1}&per_page=${page_size}`
  }

  const { data, size, setSize, mutate, isLoading, error } = useSWRInfinite(
    getKey,
    FetchNotes,
    {
      onSuccess: (pages) => {
        const allNotes = pages.flatMap(p => Array.isArray(p) ? p : p.data)
        size == 1 ? useNotes.getState().setNotes(allNotes) : useNotes.getState().mergeNotes(allNotes)
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
  const { data, mutate, error, isLoading } = useSWR(key, FetchNotes,
    {
      onSuccess: (notes) => {
        if (Array.isArray(notes)) useSaveNotes.getState().setSaveNotes(notes)
      }
    })

  return { saveNotes: data, mutateSaveNote: mutate, error, isLoading }
}

export function useSearchNoteData(keyword: string) {
  const key = keyword ? `/api/notes?search=${keyword}` : null;
  const { data, error, mutate, isLoading } = useSWR(key, FetchNotes)

  return { searchNotes: data, mutateSearchNotes: mutate, error, isLoading }
}

export function useNoteId(id: string) {
  const key = id ?? null;
  const { data, error, mutate, isLoading } = useSWR(key, FetchNoteId, {
    onSuccess: (note) => {
      log("note ", note)
      useNotes.getState().addNoteToStore(note)
    }
  })

  return { note: data, mutateNoteId: mutate, error, isLoading }
}