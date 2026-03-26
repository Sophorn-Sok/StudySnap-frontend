import { api } from '@/services/apiClient';
import { AIResponse } from '../types';

export const aiService = {
  async generateNoteSummary(noteId: string): Promise<string> {
    const response = await api.post<{ summary: string }>(`/ai/notes/${noteId}/summarize`);
    return response.data.summary;
  },

  async generateFlashcards(noteId: string, count: number = 10): Promise<any[]> {
    const response = await api.post(`/ai/notes/${noteId}/generate-flashcards`, { count });
    return response.data;
  },

  async generateMeetingNotes(meetingId: string): Promise<string> {
    const response = await api.post<{ notes: string }>(`/ai/meetings/${meetingId}/generate-notes`);
    return response.data.notes;
  },

  async askQuestion(context: string, question: string): Promise<string> {
    const response = await api.post<{ answer: string }>('/ai/ask', { context, question });
    return response.data.answer;
  },
};
