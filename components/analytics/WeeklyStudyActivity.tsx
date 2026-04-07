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

const chartData = [
  { date: '2024-04-01', flashcards: 45, reviews: 28 },
  { date: '2024-04-02', flashcards: 32, reviews: 18 },
  { date: '2024-04-03', flashcards: 67, reviews: 35 },
  { date: '2024-04-04', flashcards: 52, reviews: 42 },
  { date: '2024-04-05', flashcards: 78, reviews: 55 },
  { date: '2024-04-06', flashcards: 40, reviews: 30 },
  { date: '2024-04-07', flashcards: 25, reviews: 15 },
  { date: '2024-04-08', flashcards: 88, reviews: 60 },
  { date: '2024-04-09', flashcards: 55, reviews: 38 },
  { date: '2024-04-10', flashcards: 62, reviews: 45 },
  { date: '2024-04-11', flashcards: 70, reviews: 50 },
  { date: '2024-04-12', flashcards: 48, reviews: 32 },
  { date: '2024-04-13', flashcards: 35, reviews: 22 },
  { date: '2024-04-14', flashcards: 20, reviews: 12 },
  { date: '2024-04-15', flashcards: 90, reviews: 65 },
  { date: '2024-04-16', flashcards: 75, reviews: 52 },
  { date: '2024-04-17', flashcards: 82, reviews: 58 },
  { date: '2024-04-18', flashcards: 60, reviews: 40 },
  { date: '2024-04-19', flashcards: 45, reviews: 30 },
  { date: '2024-04-20', flashcards: 30, reviews: 18 },
  { date: '2024-04-21', flashcards: 22, reviews: 14 },
  { date: '2024-04-22', flashcards: 95, reviews: 70 },
  { date: '2024-04-23', flashcards: 68, reviews: 48 },
  { date: '2024-04-24', flashcards: 72, reviews: 55 },
  { date: '2024-04-25', flashcards: 58, reviews: 42 },
  { date: '2024-04-26', flashcards: 85, reviews: 62 },
  { date: '2024-04-27', flashcards: 42, reviews: 28 },
  { date: '2024-04-28', flashcards: 28, reviews: 16 },
  { date: '2024-04-29', flashcards: 76, reviews: 54 },
  { date: '2024-04-30', flashcards: 92, reviews: 68 },
  { date: '2024-05-01', flashcards: 50, reviews: 35 },
  { date: '2024-05-02', flashcards: 65, reviews: 45 },
  { date: '2024-05-03', flashcards: 80, reviews: 58 },
  { date: '2024-05-04', flashcards: 55, reviews: 38 },
  { date: '2024-05-05', flashcards: 38, reviews: 25 },
  { date: '2024-05-06', flashcards: 42, reviews: 30 },
  { date: '2024-05-07', flashcards: 88, reviews: 64 },
  { date: '2024-05-08', flashcards: 70, reviews: 50 },
  { date: '2024-05-09', flashcards: 62, reviews: 44 },
  { date: '2024-05-10', flashcards: 78, reviews: 56 },
  { date: '2024-05-11', flashcards: 52, reviews: 36 },
  { date: '2024-05-12', flashcards: 35, reviews: 22 },
  { date: '2024-05-13', flashcards: 28, reviews: 18 },
  { date: '2024-05-14', flashcards: 98, reviews: 72 },
  { date: '2024-05-15', flashcards: 85, reviews: 60 },
  { date: '2024-05-16', flashcards: 72, reviews: 52 },
  { date: '2024-05-17', flashcards: 90, reviews: 65 },
  { date: '2024-05-18', flashcards: 60, reviews: 42 },
  { date: '2024-05-19', flashcards: 45, reviews: 30 },
  { date: '2024-05-20', flashcards: 32, reviews: 20 },
  { date: '2024-05-21', flashcards: 55, reviews: 38 },
  { date: '2024-05-22', flashcards: 68, reviews: 48 },
  { date: '2024-05-23', flashcards: 75, reviews: 55 },
  { date: '2024-05-24', flashcards: 82, reviews: 60 },
  { date: '2024-05-25', flashcards: 48, reviews: 34 },
  { date: '2024-05-26', flashcards: 38, reviews: 24 },
  { date: '2024-05-27', flashcards: 92, reviews: 68 },
  { date: '2024-05-28', flashcards: 65, reviews: 46 },
  { date: '2024-05-29', flashcards: 58, reviews: 40 },
  { date: '2024-05-30', flashcards: 78, reviews: 56 },
  { date: '2024-05-31', flashcards: 42, reviews: 30 },
  { date: '2024-06-01', flashcards: 35, reviews: 22 },
  { date: '2024-06-02', flashcards: 85, reviews: 62 },
  { date: '2024-06-03', flashcards: 70, reviews: 50 },
  { date: '2024-06-04', flashcards: 95, reviews: 70 },
  { date: '2024-06-05', flashcards: 50, reviews: 35 },
  { date: '2024-06-06', flashcards: 62, reviews: 44 },
  { date: '2024-06-07', flashcards: 75, reviews: 55 },
  { date: '2024-06-08', flashcards: 88, reviews: 64 },
  { date: '2024-06-09', flashcards: 80, reviews: 58 },
  { date: '2024-06-10', flashcards: 45, reviews: 32 },
  { date: '2024-06-11', flashcards: 55, reviews: 38 },
  { date: '2024-06-12', flashcards: 98, reviews: 72 },
  { date: '2024-06-13', flashcards: 40, reviews: 28 },
  { date: '2024-06-14', flashcards: 72, reviews: 52 },
  { date: '2024-06-15', flashcards: 65, reviews: 46 },
  { date: '2024-06-16', flashcards: 82, reviews: 60 },
  { date: '2024-06-17', flashcards: 90, reviews: 68 },
  { date: '2024-06-18', flashcards: 48, reviews: 34 },
  { date: '2024-06-19', flashcards: 68, reviews: 48 },
  { date: '2024-06-20', flashcards: 85, reviews: 62 },
  { date: '2024-06-21', flashcards: 52, reviews: 36 },
  { date: '2024-06-22', flashcards: 75, reviews: 55 },
  { date: '2024-06-23', flashcards: 92, reviews: 70 },
  { date: '2024-06-24', flashcards: 42, reviews: 30 },
  { date: '2024-06-25', flashcards: 58, reviews: 42 },
  { date: '2024-06-26', flashcards: 80, reviews: 58 },
  { date: '2024-06-27', flashcards: 95, reviews: 72 },
  { date: '2024-06-28', flashcards: 48, reviews: 34 },
  { date: '2024-06-29', flashcards: 35, reviews: 24 },
  { date: '2024-06-30', flashcards: 88, reviews: 65 },
];

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

export const WeeklyStudyActivity = () => {
  const [activeChart, setActiveChart] =
    React.useState<'flashcards' | 'reviews'>('flashcards');

  const total = React.useMemo(
    () => ({
      flashcards: chartData.reduce((acc, curr) => acc + curr.flashcards, 0),
      reviews: chartData.reduce((acc, curr) => acc + curr.reviews, 0),
    }),
    []
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
            Showing total study sessions for the last 3 months
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
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
                  className="w-[150px]"
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
      </CardContent>
    </Card>
  );
};
