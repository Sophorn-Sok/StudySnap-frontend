'use client';

import { Progress } from "@/components/ui/progress"

interface DeckProgress {
  id: string;
  name: string;
  progress: number;
  color: string;
}

const mockDecks: DeckProgress[] = [
  { id: '1', name: 'Algorithms Deck', progress: 75, color: 'bg-purple-500' },
  { id: '2', name: 'AI Concepts', progress: 60, color: 'bg-blue-500' },
  { id: '3', name: 'Statistics Deck', progress: 82, color: 'bg-purple-600' },
];

export const FlashcardProgress = () => {
  const colorMap: Record<string, string> = {
    'bg-purple-500': 'rgb(168, 85, 247)',
    'bg-blue-500': 'rgb(59, 130, 246)',
    'bg-purple-600': 'rgb(147, 51, 234)',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Flashcard Progress</h3>
      <div className="space-y-4">
        {mockDecks.map((deck) => (
          <div key={deck.id} className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900">{deck.name}</h4>
              <span className="text-sm font-semibold text-gray-700">{deck.progress}%</span>
            </div>
            <div
              data-progress-id={deck.id}
              style={{
                '--progress-color': colorMap[deck.color as keyof typeof colorMap],
              } as React.CSSProperties}
            >
              <style>{`
                [data-progress-id="${deck.id}"] [data-slot="progress-indicator"] {
                  background-color: var(--progress-color) !important;
                }
              `}</style>
              <Progress value={deck.progress} className="w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};