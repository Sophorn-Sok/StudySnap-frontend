export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  sharedWith?: string[]; // User IDs
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface NoteVersion {
  id: string;
  noteId: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}
