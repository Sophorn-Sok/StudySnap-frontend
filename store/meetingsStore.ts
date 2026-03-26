import { create } from 'zustand';
import { Meeting } from '@/types';
import { meetingsService } from '@/services/meetings.api';

interface MeetingsStore {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  isLoading: boolean;
  error: string | null;
  fetchMeetings: () => Promise<void>;
  fetchMeetingById: (id: string) => Promise<void>;
  createMeeting: (title: string, transcript: string, duration: number) => Promise<Meeting>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;
  setSelectedMeeting: (meeting: Meeting | null) => void;
}

export const useMeetingsStore = create<MeetingsStore>((set) => ({
  meetings: [],
  selectedMeeting: null,
  isLoading: false,
  error: null,

  fetchMeetings: async () => {
    set({ isLoading: true, error: null });
    try {
      const meetings = await meetingsService.getMeetings();
      set({ meetings, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchMeetingById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const meeting = await meetingsService.getMeetingById(id);
      set({ selectedMeeting: meeting, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createMeeting: async (title: string, transcript: string, duration: number) => {
    try {
      const meeting = await meetingsService.createMeeting({ title, transcript, duration });
      set((state) => ({ meetings: [...state.meetings, meeting] }));
      return meeting;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateMeeting: async (id: string, updates: Partial<Meeting>) => {
    try {
      const meeting = await meetingsService.updateMeeting(id, updates as any);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,
      }));
      return meeting;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteMeeting: async (id: string) => {
    try {
      await meetingsService.deleteMeeting(id);
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== id),
        selectedMeeting: state.selectedMeeting?.id === id ? null : state.selectedMeeting,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setSelectedMeeting: (meeting: Meeting | null) => set({ selectedMeeting: meeting }),
}));
