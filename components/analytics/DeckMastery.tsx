'use client';

import { Card, CardContent } from '@/components/ui/Card';

interface DeckProgress {
  name: string;
  percentage: number;
  color: string;
}

const decks: DeckProgress[] = [
  { name: 'Algorithms', percentage: 75, color: 'bg-blue-500' },
  { name: 'AI Concepts', percentage: 60, color: 'bg-purple-500' },
  { name: 'Statistics', percentage: 82, color: 'bg-emerald-500' },
  { name: 'Data Structures', percentage: 45, color: 'bg-amber-500' },
  { name: 'Machine Learning', percentage: 55, color: 'bg-red-500' },
];

export const DeckMastery = () => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-base font-semibold text-gray-900">Deck Mastery</h3>
      </div>
      <CardContent className="pb-5 space-y-4">
        {decks.map((deck) => (
          <div key={deck.name} className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-32 shrink-0">{deck.name}</span>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${deck.color} transition-all duration-500`}
                style={{ width: `${deck.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 w-10 text-right">
              {deck.percentage}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
