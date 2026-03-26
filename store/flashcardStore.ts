import { create } from 'zustand';import { create } from 'zustand';



















































































}));  setSelectedMeeting: (meeting: Meeting | null) => set({ selectedMeeting: meeting }),  },    }      throw error;      set({ error: (error as Error).message });    } catch (error) {      }));        selectedMeeting: state.selectedMeeting?.id === id ? null : state.selectedMeeting,        meetings: state.meetings.filter((m) => m.id !== id),      set((state) => ({      await meetingsService.deleteMeeting(id);    try {  deleteMeeting: async (id: string) => {  },    }      throw error;      set({ error: (error as Error).message });    } catch (error) {      return meeting;      }));        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),      set((state) => ({      const meeting = await meetingsService.updateMeeting(id, updates as any);    try {  updateMeeting: async (id: string, updates: Partial<Meeting>) => {  },    }      throw error;      set({ error: (error as Error).message });    } catch (error) {      return meeting;      set((state) => ({ meetings: [...state.meetings, meeting] }));      const meeting = await meetingsService.createMeeting({ title, transcript, duration });    try {  createMeeting: async (title: string, transcript: string, duration: number) => {  },    }      set({ error: (error as Error).message, isLoading: false });    } catch (error) {      set({ selectedMeeting: meeting, isLoading: false });      const meeting = await meetingsService.getMeetingById(id);    try {    set({ isLoading: true, error: null });  fetchMeetingById: async (id: string) => {  },    }      set({ error: (error as Error).message, isLoading: false });    } catch (error) {      set({ meetings, isLoading: false });      const meetings = await meetingsService.getMeetings();    try {    set({ isLoading: true, error: null });  fetchMeetings: async () => {  error: null,  isLoading: false,  selectedMeeting: null,  meetings: [],export const useMeetingsStore = create<MeetingsStore>((set) => ({}  setSelectedMeeting: (meeting: Meeting | null) => void;  deleteMeeting: (id: string) => Promise<void>;  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<Meeting>;  createMeeting: (title: string, transcript: string, duration: number) => Promise<Meeting>;  fetchMeetingById: (id: string) => Promise<void>;  fetchMeetings: () => Promise<void>;  error: string | null;  isLoading: boolean;  selectedMeeting: Meeting | null;  meetings: Meeting[];interface MeetingsStore {import { meetingsService } from '@/services/meetings.api';import { Meeting } from '@/types';import { FlashcardDeck } from '@/types';
import { flashcardsService } from '@/services/flashcards.api';

interface FlashcardStore {
  decks: FlashcardDeck[];
  selectedDeck: FlashcardDeck | null;
  isLoading: boolean;
  error: string | null;
  fetchDecks: () => Promise<void>;
  fetchDeckById: (id: string) => Promise<void>;
  createDeck: (title: string, description?: string) => Promise<FlashcardDeck>;
  updateDeck: (id: string, updates: Partial<FlashcardDeck>) => Promise<FlashcardDeck>;
  deleteDeck: (id: string) => Promise<void>;
  setSelectedDeck: (deck: FlashcardDeck | null) => void;
}

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  decks: [],
  selectedDeck: null,
  isLoading: false,
  error: null,

  fetchDecks: async () => {
    set({ isLoading: true, error: null });
    try {
      const decks = await flashcardsService.getDecks();
      set({ decks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchDeckById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const deck = await flashcardsService.getDeckById(id);
      set({ selectedDeck: deck, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createDeck: async (title: string, description?: string) => {
    try {
      const deck = await flashcardsService.createDeck({ title, description });
      set((state) => ({ decks: [...state.decks, deck] }));
      return deck;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateDeck: async (id: string, updates: Partial<FlashcardDeck>) => {
    try {
      const deck = await flashcardsService.updateDeck(id, updates as any);
      set((state) => ({
        decks: state.decks.map((d) => (d.id === id ? deck : d)),
        selectedDeck: state.selectedDeck?.id === id ? deck : state.selectedDeck,
      }));
      return deck;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteDeck: async (id: string) => {
    try {
      await flashcardsService.deleteDeck(id);
      set((state) => ({
        decks: state.decks.filter((d) => d.id !== id),
        selectedDeck: state.selectedDeck?.id === id ? null : state.selectedDeck,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setSelectedDeck: (deck: FlashcardDeck | null) => set({ selectedDeck: deck }),
}));
