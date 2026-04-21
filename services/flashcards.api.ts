import { api } from './apiClient';
import { FlashcardDeck, Flashcard, StudySession, CreateDeckPayload, CreateCardPayload } from '@/types';

export const flashcardsService = {
  async getDecks(): Promise<FlashcardDeck[]> {
    const response = await api.get<FlashcardDeck[]>('/flashcards/decks');
    return response.data;
  },

  async getDeckById(id: string): Promise<FlashcardDeck> {
    const response = await api.get<FlashcardDeck>(`/flashcards/decks/${id}`);
    return response.data;
  },

  async createDeck(payload: CreateDeckPayload): Promise<FlashcardDeck> {
    const response = await api.post<FlashcardDeck>('/flashcards/decks', payload);
    return response.data;
  },

  async updateDeck(id: string, payload: Partial<CreateDeckPayload>): Promise<FlashcardDeck> {
    const response = await api.put<FlashcardDeck>(`/flashcards/decks/${id}`, payload);
    return response.data;
  },

  async deleteDeck(id: string): Promise<void> {
    await api.delete(`/flashcards/decks/${id}`);
  },

  async addCard(deckId: string, payload: CreateCardPayload): Promise<Flashcard> {
    const response = await api.post<Flashcard>(`/flashcards/decks/${deckId}/cards`, payload);
    return response.data;
  },

  async updateCard(deckId: string, cardId: string, payload: Partial<CreateCardPayload>): Promise<Flashcard> {
    const response = await api.put<Flashcard>(`/flashcards/decks/${deckId}/cards/${cardId}`, payload);
    return response.data;
  },

  async deleteCard(deckId: string, cardId: string): Promise<void> {
    await api.delete(`/flashcards/decks/${deckId}/cards/${cardId}`);
  },

  async startStudySession(deckId: string): Promise<StudySession> {
    const response = await api.post<StudySession>(`/flashcards/sessions`, { deckId });
    return response.data;
  },

  async completeStudySession(sessionId: string, correctAnswers: number): Promise<StudySession> {
    const response = await api.post<StudySession>(`/flashcards/sessions/${sessionId}/complete`, { correctAnswers });
    return response.data;
  },

  async getStudySessions(params?: { deckId?: string }): Promise<StudySession[]> {
    const response = await api.get<StudySession[]>('/flashcards/sessions', { params });
    return response.data;
  },
};
