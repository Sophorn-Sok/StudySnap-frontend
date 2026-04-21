'use client';

import { Progress } from "@/components/ui/progress"
import { FlashcardDeck } from '@/types';

interface DeckProgress {
  id: string;
  name: string;
  progress: number;
  color: string;
}

interface FlashcardProgressProps {
  decks: FlashcardDeck[];
  isLoading?: boolean;
}

const BAR_COLORS = [
  'rgb(168, 85, 247)',
  'rgb(59, 130, 246)',
  'rgb(147, 51, 234)',
];

function toDeckProgress(decks: FlashcardDeck[]): DeckProgress[] {
  return decks.slice(0, 3).map((deck, index) => {
    const reviewCounts = deck.cards.map((card) => Math.max(0, card.reviewCount ?? 0));
    const reviewedProgress = reviewCounts.length
      ? Math.round(
          (reviewCounts.reduce((sum, count) => sum + Math.min(count, 10), 0) /
            (reviewCounts.length * 10)) *
            100,
        )
      : 0;

    const fallbackProgress = deck.cardCount > 0 ? Math.min(95, deck.cardCount * 10) : 0;

    return {
      id: deck.id,
      name: deck.title,
      progress: reviewedProgress > 0 ? reviewedProgress : fallbackProgress,
      color: BAR_COLORS[index % BAR_COLORS.length],
    };
  });
}

export const FlashcardProgress = ({ decks, isLoading = false }: FlashcardProgressProps) => {
  const normalizedDecks = toDeckProgress(decks);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Flashcard Progress</h3>
      <div className="space-y-4">
        {isLoading && <p className="text-sm text-gray-500">Loading deck progress...</p>}

        {!isLoading && normalizedDecks.length === 0 && (
          <p className="text-sm text-gray-500">No flashcard decks yet.</p>
        )}

        {!isLoading && normalizedDecks.map((deck) => (
          <div key={deck.id} className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900">{deck.name}</h4>
              <span className="text-sm font-semibold text-gray-700">{deck.progress}%</span>
            </div>
            <div
              data-progress-id={deck.id}
              style={{
                '--progress-color': deck.color,
              } as React.CSSProperties}
            >
              <style>{`
                [data-progress-id="${deck.id}"] [data-slot="progress-indicator"] {
                  background-color: var(--progress-color) !important;
                }
              `}</style>
              <Progress value={deck.progress} className="w-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};