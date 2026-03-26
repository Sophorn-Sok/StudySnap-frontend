import { meetingsService } from '@/services/meetings.api';

export const meetingsFeatureService = {
  async getMeetings() {
    return await meetingsService.getMeetings();
  },

  async getMeetingById(id: string) {
    return await meetingsService.getMeetingById(id);
  },

  async createMeeting(title: string, transcript: string, duration: number) {
    return await meetingsService.createMeeting({ title, transcript, duration });
  },

  async updateMeeting(id: string, title?: string, aiNotes?: string) {
    return await meetingsService.updateMeeting(id, { title, aiNotes } as any);
  },

  async deleteMeeting(id: string) {
    return await meetingsService.deleteMeeting(id);
  },

  async generateAINotes(id: string) {
    return await meetingsService.generateAINotes(id);
  },
};
