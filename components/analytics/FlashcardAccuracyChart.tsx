'use client';

import { Card, CardContent } from '@/components/ui/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartData = [
  { week: 'W1', correct: 55, incorrect: 20 },
  { week: 'W2', correct: 60, incorrect: 15 },
  { week: 'W3', correct: 50, incorrect: 18 },
  { week: 'W4', correct: 65, incorrect: 12 },
  { week: 'W5', correct: 70, incorrect: 10 },
  { week: 'W6', correct: 75, incorrect: 8 },
];

const chartConfig: ChartConfig = {
  correct: {
    label: 'Correct',
    color: '#818cf8',
  },
  incorrect: {
    label: 'Incorrect',
    color: '#c4b5fd',
  },
};

export const FlashcardAccuracyChart = () => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-base font-semibold text-gray-900">Flashcard Accuracy</h3>
      </div>
      <CardContent className="pb-5">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(val) => `${val}%`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            />
            <Bar dataKey="correct" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="incorrect" fill="#c4b5fd" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
