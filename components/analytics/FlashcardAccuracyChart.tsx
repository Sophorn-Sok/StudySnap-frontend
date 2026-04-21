'use client';

import { Card, CardContent } from '@/components/ui/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface FlashcardAccuracyChartProps {
  chartData: Array<{ week: string; correct: number; incorrect: number }>;
  isLoading?: boolean;
}

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

export const FlashcardAccuracyChart = ({ chartData, isLoading = false }: FlashcardAccuracyChartProps) => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-base font-semibold text-gray-900">Flashcard Accuracy</h3>
      </div>
      <CardContent className="pb-5">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading accuracy data...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-gray-500">No study session accuracy yet.</p>
        ) : (
        <ChartContainer config={chartConfig} className="h-55 w-full">
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
        )}
      </CardContent>
    </Card>
  );
};
