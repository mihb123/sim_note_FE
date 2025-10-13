import useSWRInfinite from 'swr/infinite'
import { useShallow } from 'zustand/shallow'
import { FetchNotes } from '@/api/note.api'
import useNotes from '@/hooks/useNotes'
import config from '@/app.config'

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
      revalidateOnFocus: true,
      dedupingInterval: 500,
      onSuccess: (pages) => {
        log('fetch data', pages)
        const allNotes = pages.flatMap(p => p.data)
        setNotes(allNotes)
      }
    }
  )
  const loadMore = () => setSize(size + 1)
  const hasMore = data && data[data.length - 1]?.data.length == page_size
  return { isLoading, error, mutateNote: mutate, loadMore, hasMore }  
}