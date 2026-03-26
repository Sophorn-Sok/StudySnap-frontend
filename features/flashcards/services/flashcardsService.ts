import { flashcardsService } from '@/services/flashcards.api';

export const flashcardsFeatureService = {
  async getDecks() {
    return await flashcardsService.getDecks();
  },

  async getDeckById(id: string) {
    return await flashcardsService.getDeckById(id);
  },

  async createDeck(title: string, description?: string) {
    return await flashcardsService.createDeck({ title, description });
  },

  async updateDeck(id: string, title?: string, description?: string) {
    return await flashcardsService.updateDeck(id, { title, description });
  },

  async deleteDeck(id: string) {
    return await flashcardsService.deleteDeck(id);
  },

  async addCard(deckId: string, front: string, back: string) {
    return await flashcardsService.addCard(deckId, { front, back });
  },

  async deleteCard(deckId: string, cardId: string) {
    return await flashcardsService.deleteCard(deckId, cardId);
  },
};
