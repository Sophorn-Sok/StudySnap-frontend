import { useNotesStore } from '@/store';
import { useDebounce } from '@/hooks';
import { useMemo } from 'react';

export const useNotesList = (searchQuery?: string) => {
  const { notes, fetchNotes } = useNotesStore();
  const debouncedQuery = useDebounce(searchQuery || '', 300);

  const filteredNotes = useMemo(() => {
    if (!debouncedQuery) return notes;
    return notes.filter((note) =>
      note.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [notes, debouncedQuery]);

  return {
    notes: filteredNotes,
    fetchNotes,
    allNotes: notes,
  };
};
