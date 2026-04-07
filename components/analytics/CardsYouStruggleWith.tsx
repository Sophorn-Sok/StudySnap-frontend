'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

type Difficulty = 'Hard' | 'Medium' | 'Easy';

interface StruggleCard {
  question: string;
  difficulty: Difficulty;
}

const cards: StruggleCard[] = [
  { question: "What is the time complexity of Dijkstra's algorithm?", difficulty: 'Hard' },
  { question: 'Explain the difference between precision and recall.', difficulty: 'Hard' },
  { question: 'What is backpropagation in neural networks?', difficulty: 'Medium' },
  { question: 'Define amortized analysis with an example.', difficulty: 'Easy' },
];

const difficultyConfig: Record<
  Difficulty,
  { badgeBg: string; badgeText: string; buttonVariant: 'primary' | 'outline' | 'secondary' }
> = {
  Hard: {
    badgeBg: 'bg-red-50 border border-red-200',
    badgeText: 'text-red-600',
    buttonVariant: 'primary',
  },
  Medium: {
    badgeBg: 'bg-amber-50 border border-amber-200',
    badgeText: 'text-amber-600',
    buttonVariant: 'outline',
  },
  Easy: {
    badgeBg: 'bg-emerald-50 border border-emerald-200',
    badgeText: 'text-emerald-600',
    buttonVariant: 'secondary',
  },
};

export const CardsYouStruggleWith = () => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-base font-semibold text-gray-900">Cards You Struggle With</h3>
      </div>
      <CardContent className="pb-5 space-y-3">
        {cards.map((card, index) => {
          const cfg = difficultyConfig[card.difficulty];
          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-3 bg-gray-50/70 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-150"
            >
              <p className="text-sm text-gray-700 flex-1 min-w-0 truncate">{card.question}</p>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
                >
                  {card.difficulty}
                </span>
                <Button variant={cfg.buttonVariant} size="sm" className="gap-1 text-xs">
                  <RotateCcw className="w-3 h-3" />
                  Review
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
