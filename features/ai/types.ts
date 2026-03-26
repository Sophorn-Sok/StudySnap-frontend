export interface AIResponse {
  id: string;
  prompt: string;
  response: string;
  model: string;
  createdAt: Date;
}

export interface AIPromptContext {
  noteId?: string;
  meetingId?: string;
  flashcardDeckId?: string;
}
