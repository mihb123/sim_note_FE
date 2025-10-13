import { NoteItem } from "./NoteItem";
import { NoteItemSkeleton } from "./NoteItemSkeleton";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useNotes from '@/hooks/useNotes';
import { useShallow } from "zustand/shallow";
import useFocusNote from "@/hooks/useFocusNote";
import useActiveTab from "@/hooks/useActiveTab";
import useNotesData from "@/data/note.data";

export const NoteList = memo(() => {
  const notes = useNotes((state) => state.notes);
  const { focusNote, setFocusNote } = useFocusNote(useShallow(state => ({ focusNote: state.focusNote, setFocusNote: state.setFocusNote })));
  const activeTab = useActiveTab((state)=>state.activeTab);
  const noteListRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { loadMore, isLoading, hasMore, error } = useNotesData();

  const sortedNotes = useMemo(() => {
    return Object.values(notes).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [notes]);

  const saveNotes = useMemo(() => {
    return Object.values(notes).filter(note => note.is_save);
  }, [notes]);

  let noteList = sortedNotes;
  if (activeTab == "save") noteList = saveNotes;

  let savedNoteId = localStorage.getItem("focusNoteId") || "";
  if (!notes[savedNoteId]) savedNoteId = sortedNotes[0]?.id;
  setFocusNote(savedNoteId);
  
  useEffect(() => {
    if (!focusNote?.id || !noteListRef.current) return;

    if (isInitialLoad) {
      const selectedNoteEl = noteListRef.current.querySelector(`[data-note-id="${focusNote.id}"]`);
      selectedNoteEl?.scrollIntoView({ block: "center" });
      setIsInitialLoad(false);
    }

  }, [focusNote, isInitialLoad, sortedNotes.length]);

  const handleScroll = useCallback(() => {
    const el = noteListRef.current;
    if (!el || !hasMore || isLoading || error) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore]);

  const isInitialLoading = isLoading && Object.keys(notes).length === 0;

  return (
    <div ref={noteListRef} onScroll={handleScroll} className="noteList flex-1 overflow-y-auto flex flex-col px-4 mr-2">
      {isInitialLoading ? (
        Array.from({ length: 10 }).map((_, index) => <NoteItemSkeleton key={index} />)
      ) : (
        noteList.map(note => <NoteItem key={note.id} note={note} isSelected={note.id === focusNote?.id} data-note-id={note.id} />)
      )}
      {(hasMore && noteList.length > 30) && (         
        <div>
          {Array.from({ length: 2 }).map((_, index) => <NoteItemSkeleton key={index} />)}
        </div>
      )}
      {(!hasMore && noteList.length > 30) && <div className="mb-2"><p className="text-center py-1 dark:text-gray-600 text-gray-400">The end of list</p></div>}
    </div>
  );
})