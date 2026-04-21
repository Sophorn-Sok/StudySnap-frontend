'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { CalendarDays, TrendingUp, Layers } from 'lucide-react';

interface SummaryItem {
  icon: React.ReactNode;
  iconBgColor: string;
  text: string;
}

interface WeeklySummaryProps {
  studiedDays: number;
  accuracyDelta: number;
  reviewedCards: number;
}

export const WeeklySummary = ({ studiedDays, accuracyDelta, reviewedCards }: WeeklySummaryProps) => {
  const formattedDelta = `${accuracyDelta >= 0 ? '+' : ''}${accuracyDelta}%`;
  const summaryItems: SummaryItem[] = [
    {
      icon: <CalendarDays className="w-4 h-4 text-blue-600" />,
      iconBgColor: 'bg-blue-100',
      text: `Studied ${studiedDays} day${studiedDays === 1 ? '' : 's'} this week`,
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      iconBgColor: 'bg-green-100',
      text: `Accuracy changed by ${formattedDelta} vs last week`,
    },
    {
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      iconBgColor: 'bg-purple-100',
      text: `Reviewed ${reviewedCards} cards this week`,
    },
  ];

  return (
    <Card className="shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-base font-semibold text-gray-900">Weekly Summary</h3>
      </div>
      <CardContent className="pb-5 space-y-3">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.iconBgColor}`}>
              {item.icon}
            </div>
            <p className="text-sm font-medium text-gray-700">{item.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
