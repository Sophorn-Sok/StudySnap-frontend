'use client';

import { Card, CardContent } from '@/components/ui/Card';

interface DeckProgress {
  name: string;
  percentage: number;
}

interface DeckMasteryProps {
  decks: DeckProgress[];
  isLoading?: boolean;
}

const progressColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500'];

export const DeckMastery = ({ decks, isLoading = false }: DeckMasteryProps) => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-base font-semibold text-gray-900">Deck Mastery</h3>
      </div>
      <CardContent className="pb-5 space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading deck mastery...</p>
        ) : decks.length === 0 ? (
          <p className="text-sm text-gray-500">No decks available yet.</p>
        ) : (
          decks.map((deck, index) => (
          <div key={deck.name} className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-32 shrink-0">{deck.name}</span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${progressColors[index % progressColors.length]} transition-all duration-500`}
                style={{ width: `${deck.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 w-10 text-right">
              {deck.percentage}%
            </span>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
