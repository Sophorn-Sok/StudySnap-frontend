export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewedAt?: Date;
  reviewCount: number;
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  title: string;
  description?: string;
  cards: Flashcard[];
  cardCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  deckId: string;
  cardsStudied: number;
  correctAnswers: number;
  startedAt: Date;
  endedAt?: Date;
}

export interface CreateDeckPayload {
  title: string;
  description?: string;
}

export interface CreateCardPayload {
  front: string;
  back: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AIGeneratedDeckResponse {
  deck: FlashcardDeck;
  summary: string;
  keyPoints: string[];
  sourceMeetingId: string;
  generatedCount: number;
}
