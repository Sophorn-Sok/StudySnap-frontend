import { api } from './apiClient';
import { Note, CreateNotePayload, UpdateNotePayload, NoteVersion } from '@/types';

export const notesService = {
  async getNotes(params?: { tags?: string[]; search?: string }): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes', { params });
    return response.data;
  },

  async getNoteById(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async createNote(payload: CreateNotePayload): Promise<Note> {
    const response = await api.post<Note>('/notes', payload);
    return response.data;
  },

  async updateNote(id: string, payload: UpdateNotePayload): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, payload);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async shareNote(id: string, userIds: string[]): Promise<Note> {
    const response = await api.post<Note>(`/notes/${id}/share`, { userIds });
    return response.data;
  },

  async getNoteVersions(id: string): Promise<NoteVersion[]> {
    const response = await api.get<NoteVersion[]>(`/notes/${id}/versions`);
    return response.data;
  },

  async restoreNoteVersion(id: string, versionId: string): Promise<Note> {
    const response = await api.post<Note>(`/notes/${id}/restore/${versionId}`);
    return response.data;
  },
};
