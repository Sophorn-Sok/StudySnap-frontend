import { Note } from '@/types';

export interface NoteFilters {
  tags?: string[];
  search?: string;
  sortBy?: 'recent' | 'oldest' | 'alphabetical';
}

export interface NoteContextType {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  fetchNotes: (filters?: NoteFilters) => Promise<void>;
  setSelectedNote: (note: Note | null) => void;
}
