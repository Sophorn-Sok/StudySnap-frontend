'use client';

import { create } from 'zustand';
import { FlashcardDeck } from '@/types';
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
    try {
      set({ isLoading: true, error: null });
      const decks = await flashcardsService.getDecks();
      set({ decks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchDeckById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const deck = await flashcardsService.getDeckById(id);
      set({ selectedDeck: deck, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createDeck: async (title: string, description?: string) => {
    try {
      set({ error: null });
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
      set({ error: null });
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
      set({ error: null });
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
