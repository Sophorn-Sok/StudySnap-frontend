export interface Meeting {
  id: string;
  userId: string;
  title: string;
  transcript: string;
  aiNotes: string;
  recordingUrl?: string;
  duration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

export interface TranscriptSegment {
  id: string;
  meetingId: string;
  speaker: string;
  text: string;
  timestamp: number;
}

export interface AIGeneratedNotes {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  tags: string[];
}

export interface CreateMeetingPayload {
  title: string;
  transcript: string;
  recordingUrl?: string;
  duration: number;
}

export interface UpdateMeetingPayload {
  title?: string;
  aiNotes?: string;
}
