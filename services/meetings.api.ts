import { api } from './apiClient';
import { Meeting, CreateMeetingPayload, UpdateMeetingPayload, AIGeneratedNotes } from '@/types';

type UploadMeetingMediaResponse = {
  recordingUrl: string;
  provider?: 'vertex';
  note?: {
    id: string;
    title: string;
  };
};

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

  async uploadRecording(id: string, file: File): Promise<UploadMeetingMediaResponse> {
    const formData = new FormData();
    formData.append('media', file);
    const response = await api.post<UploadMeetingMediaResponse>(`/meetings/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    });
    return response.data;
  },
};
