import { Meeting } from '@/types';

export interface MeetingFilters {
  search?: string;
  sortBy?: 'recent' | 'oldest';
}

export interface TranscriptHighlight {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  color: string;
}
