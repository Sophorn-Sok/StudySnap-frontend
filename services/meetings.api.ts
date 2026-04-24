import { api } from './apiClient';
import { Meeting, CreateMeetingPayload, UpdateMeetingPayload, AIGeneratedNotes } from '@/types';

export const meetingsService = {
  async getMeetings(): Promise<Meeting[]> {
    const response = await api.get<Meeting[]>('/meetings');
    return response.data;
  },

  async getMeetingById(id: string): Promise<Meeting> {
    const response = await api.get<Meeting>(`/meetings/${id}`);
    return response.data;
  },

  async createMeeting(payload: CreateMeetingPayload): Promise<Meeting> {
    const response = await api.post<Meeting>('/meetings', payload);
    return response.data;
  },

  async updateMeeting(id: string, payload: UpdateMeetingPayload): Promise<Meeting> {
    const response = await api.put<Meeting>(`/meetings/${id}`, payload);
    return response.data;
  },

  async deleteMeeting(id: string): Promise<void> {
    await api.delete(`/meetings/${id}`);
  },

  async generateAINotes(id: string): Promise<AIGeneratedNotes> {
    const response = await api.post<AIGeneratedNotes>(`/meetings/${id}/generate-notes`, undefined, {
      timeout: 120000,
    });
    return response.data;
  },

  async uploadRecording(id: string, file: File): Promise<{ recordingUrl: string }> {
    const formData = new FormData();
    formData.append('recording', file);
    const response = await api.post<{ recordingUrl: string }>(`/meetings/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
