import { create } from 'zustand';
import { Note } from '@/types';
import { notesService } from '@/services/notes.api';

interface NotesStore {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
  fetchNotes: (params?: { tags?: string[]; search?: string }) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (title: string, content: string, tags?: string[]) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  shareNote: (id: string, userIds: string[]) => Promise<Note>;
  setSelectedNote: (note: Note | null) => void;
}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,

  fetchNotes: async (params?: { tags?: string[]; search?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const notes = await notesService.getNotes(params);
      set({ notes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchNoteById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesService.getNoteById(id);
      set({ selectedNote: note, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createNote: async (title: string, content: string, tags?: string[]) => {
    try {
      const note = await notesService.createNote({ title, content, tags });
      set((state) => ({ notes: [...state.notes, note] }));
      return note;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    try {
      const note = await notesService.updateNote(id, updates as any);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? note : n)),
        selectedNote: state.selectedNote?.id === id ? note : state.selectedNote,
      }));
      return note;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteNote: async (id: string) => {
    try {
      await notesService.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  shareNote: async (id: string, userIds: string[]) => {
    try {
      const note = await notesService.shareNote(id, userIds);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? note : n)),
        selectedNote: state.selectedNote?.id === id ? note : state.selectedNote,
      }));
      return note;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setSelectedNote: (note: Note | null) => set({ selectedNote: note }),
}));
