'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface AnalyticsData {
  day: string;
  value: number;
}

const mockAnalytics: AnalyticsData[] = [
  { day: 'Mon', value: 8 },
  { day: 'Tue', value: 5 },
  { day: 'Wed', value: 6 },
  { day: 'Thu', value: 4 },
  { day: 'Fri', value: 7 },
  { day: 'Sat', value: 12 },
  { day: 'Sun', value: 9 },
];

const chartConfig = {
  value: {
    label: 'Study Hours',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export const StudyAnalytics = () => {
  const totalHours = mockAnalytics.reduce((sum, item) => sum + item.value, 0);
  const weekIncreasePercent = 12;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Study Time</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{totalHours}.3</span>
          <span className="text-gray-600">hours</span>
          <div className="flex items-center gap-1 ml-2 text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            +{weekIncreasePercent}% last week
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">This Week</h4>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={mockAnalytics}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={6} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
