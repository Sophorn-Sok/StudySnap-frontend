import { useFlashcardStore } from '@/store';

export const useFlashcardDecks = () => {
  const { decks, fetchDecks, createDeck, deleteDeck } = useFlashcardStore();

  return {
    decks,
    fetchDecks,
    createDeck,
    deleteDeck,
  };
};
