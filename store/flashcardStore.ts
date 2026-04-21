'use client';

import { create } from 'zustand';
import { Flashcard, FlashcardDeck, StudySession } from '@/types';
import { flashcardsService } from '@/services/flashcards.api';

interface FlashcardStore {
  decks: FlashcardDeck[];
  studySessions: StudySession[];
  selectedDeck: FlashcardDeck | null;
  isLoading: boolean;
  error: string | null;
  fetchDecks: () => Promise<void>;
  fetchStudySessions: (params?: { deckId?: string }) => Promise<void>;
  fetchDeckById: (id: string) => Promise<void>;
  createDeck: (title: string, description?: string) => Promise<FlashcardDeck>;
  updateDeck: (id: string, updates: Partial<FlashcardDeck>) => Promise<FlashcardDeck>;
  deleteDeck: (id: string) => Promise<void>;
  addCard: (deckId: string, front: string, back: string, difficulty?: 'easy' | 'medium' | 'hard') => Promise<Flashcard>;
  deleteCard: (deckId: string, cardId: string) => Promise<void>;
  startStudySession: (deckId: string) => Promise<StudySession>;
  completeStudySession: (sessionId: string, correctAnswers: number) => Promise<StudySession>;
  setSelectedDeck: (deck: FlashcardDeck | null) => void;
}

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  decks: [],
  studySessions: [],
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

  fetchStudySessions: async (params?: { deckId?: string }) => {
    try {
      set({ isLoading: true, error: null });
      const sessions = await flashcardsService.getStudySessions(params);
      set({ studySessions: sessions, isLoading: false });
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

  addCard: async (deckId: string, front: string, back: string, difficulty = 'easy') => {
    try {
      set({ error: null });
      const card = await flashcardsService.addCard(deckId, { front, back, difficulty });
      set((state) => ({
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                cards: [...deck.cards, card],
                cardCount: deck.cardCount + 1,
              }
            : deck
        ),
        selectedDeck:
          state.selectedDeck?.id === deckId
            ? {
                ...state.selectedDeck,
                cards: [...state.selectedDeck.cards, card],
                cardCount: state.selectedDeck.cardCount + 1,
              }
            : state.selectedDeck,
      }));

      return card;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteCard: async (deckId: string, cardId: string) => {
    try {
      set({ error: null });
      await flashcardsService.deleteCard(deckId, cardId);
      set((state) => ({
        decks: state.decks.map((deck) => {
          if (deck.id !== deckId) {
            return deck;
          }

          const nextCards = deck.cards.filter((card) => card.id !== cardId);
          return {
            ...deck,
            cards: nextCards,
            cardCount: nextCards.length,
          };
        }),
        selectedDeck:
          state.selectedDeck?.id === deckId
            ? {
                ...state.selectedDeck,
                cards: state.selectedDeck.cards.filter((card) => card.id !== cardId),
                cardCount: state.selectedDeck.cards.filter((card) => card.id !== cardId).length,
              }
            : state.selectedDeck,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  startStudySession: async (deckId: string) => {
    try {
      set({ error: null });
      return await flashcardsService.startStudySession(deckId);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  completeStudySession: async (sessionId: string, correctAnswers: number) => {
    try {
      set({ error: null });
      return await flashcardsService.completeStudySession(sessionId, correctAnswers);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setSelectedDeck: (deck: FlashcardDeck | null) => set({ selectedDeck: deck }),
}));
