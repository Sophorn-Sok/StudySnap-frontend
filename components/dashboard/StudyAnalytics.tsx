'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Meeting, Note } from '@/types';

interface AnalyticsData {
  day: string;
  value: number;
}

interface StudyAnalyticsProps {
  meetings: Meeting[];
  notes: Note[];
  isLoading?: boolean;
}

const chartConfig = {
  value: {
    label: 'Study Hours',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const dayIndex = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - dayIndex);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dayDiff(from: Date, to: Date) {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function computeWeekSeries(meetings: Meeting[], notes: Note[], weekStart: Date) {
  const values = Array.from({ length: 7 }, () => 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  meetings.forEach((meeting) => {
    const date = new Date(meeting.createdAt);
    if (date >= weekStart && date < weekEnd) {
      const index = dayDiff(weekStart, date);
      if (index >= 0 && index < 7) {
        values[index] += Math.max(0, meeting.duration ?? 0) / 3600;
      }
    }
  });

  notes.forEach((note) => {
    const date = new Date(note.updatedAt);
    if (date >= weekStart && date < weekEnd) {
      const index = dayDiff(weekStart, date);
      if (index >= 0 && index < 7) {
        values[index] += 0.25;
      }
    }
  });

  return values.map((value) => Number(value.toFixed(1)));
}

export const StudyAnalytics = ({ meetings, notes, isLoading = false }: StudyAnalyticsProps) => {
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const previousWeekStart = new Date(thisWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const thisWeekValues = computeWeekSeries(meetings, notes, thisWeekStart);
  const previousWeekValues = computeWeekSeries(meetings, notes, previousWeekStart);

  const analyticsData: AnalyticsData[] = DAY_LABELS.map((day, index) => ({
    day,
    value: thisWeekValues[index],
  }));

  const totalHours = Number(thisWeekValues.reduce((sum, value) => sum + value, 0).toFixed(1));
  const previousWeekTotal = previousWeekValues.reduce((sum, value) => sum + value, 0);
  const weekIncreasePercent =
    previousWeekTotal > 0
      ? Math.round(((totalHours - previousWeekTotal) / previousWeekTotal) * 100)
      : totalHours > 0
        ? 100
        : 0;
  const trendColor = weekIncreasePercent >= 0 ? 'text-green-600' : 'text-red-600';
  const trendPrefix = weekIncreasePercent >= 0 ? '+' : '';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Study Time</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{totalHours}</span>
          <span className="text-gray-600">hours</span>
          <div className={`flex items-center gap-1 ml-2 text-sm font-medium ${trendColor}`}>
            <TrendingUp className="w-4 h-4" />
            {trendPrefix}{weekIncreasePercent}% last week
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">This Week</h4>
        {isLoading && <p className="mb-2 text-sm text-gray-500">Loading analytics...</p>}
        <ChartContainer config={chartConfig} className="h-50 w-full">
          <BarChart accessibilityLayer data={analyticsData}>
            <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(37, 99, 235, 0.10)' }}
              content={
                <ChartTooltipContent className="border-blue-100 bg-white shadow-lg [&_.text-foreground]:text-gray-900! [&_.text-muted-foreground]:text-gray-600!" />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" activeBar={{ fill: '#1d4ed8' }} radius={6} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
