import { notesService } from '@/services/notes.api';

export const notesFeatureService = {
  async getNotes() {
    return await notesService.getNotes();
  },

  async getNoteById(id: string) {
    return await notesService.getNoteById(id);
  },

  async createNote(title: string, content: string, tags?: string[]) {
    return await notesService.createNote({ title, content, tags });
  },

  async updateNote(id: string, title?: string, content?: string, tags?: string[]) {
    return await notesService.updateNote(id, { title, content, tags });
  },

  async deleteNote(id: string) {
    return await notesService.deleteNote(id);
  },

  async shareNote(id: string, userIds: string[]) {
    return await notesService.shareNote(id, userIds);
  },
};
