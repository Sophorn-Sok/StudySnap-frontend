import { api } from '@/services/apiClient';

export const searchService = {
  async searchNotes(query: string) {
    const response = await api.get('/search/notes', { params: { q: query } });
    return response.data;
  },

  async searchFlashcards(query: string) {
    const response = await api.get('/search/flashcards', { params: { q: query } });
    return response.data;
  },

  async searchMeetings(query: string) {
    const response = await api.get('/search/meetings', { params: { q: query } });
    return response.data;
  },

  async globalSearch(query: string) {
    const response = await api.get('/search/global', { params: { q: query } });
    return response.data;
  },
};
