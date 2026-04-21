'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

interface WeeklyStudyActivityProps {
  chartData: Array<{ date: string; flashcards: number; reviews: number }>;
  isLoading?: boolean;
}

const chartConfig = {
  views: {
    label: 'Study Sessions',
  },
  flashcards: {
    label: 'Flashcards',
    color: '#818cf8',
  },
  reviews: {
    label: 'Reviews',
    color: '#c4b5fd',
  },
} satisfies ChartConfig;

export const WeeklyStudyActivity = ({ chartData, isLoading = false }: WeeklyStudyActivityProps) => {
  const [activeChart, setActiveChart] =
    React.useState<'flashcards' | 'reviews'>('flashcards');

  const total = React.useMemo(
    () => ({
      flashcards: chartData.reduce((acc, curr) => acc + curr.flashcards, 0),
      reviews: chartData.reduce((acc, curr) => acc + curr.reviews, 0),
    }),
    [chartData]
  );

  const chartColors = {
    flashcards: '#818cf8',
    reviews: '#c4b5fd',
  } as const;

  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-stretch border-b border-gray-200 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5">
          <h3 className="text-base font-semibold text-gray-900">
            Study Activity
          </h3>
          <p className="text-sm text-gray-500">
            Showing study sessions from your backend data
          </p>
        </div>
        <div className="flex">
          {(['flashcards', 'reviews'] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative flex flex-1 flex-col justify-center gap-1 border-t border-gray-200 px-6 py-4 text-left even:border-l even:border-gray-200 data-[active=true]:bg-indigo-50/50 sm:border-t-0 sm:border-l sm:border-gray-200 sm:px-8 sm:py-6 transition-colors"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-gray-500">
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold text-gray-900 sm:text-3xl">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <CardContent className="pb-5 pt-2 px-2 sm:px-6 sm:pt-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading study activity...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-gray-500">No study sessions yet.</p>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartColors[activeChart]}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
