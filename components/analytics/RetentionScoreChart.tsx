'use client';

import { Card, CardContent } from '@/components/ui/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartData = [
  { week: 'W1', score: 68 },
  { week: 'W2', score: 72 },
  { week: 'W3', score: 70 },
  { week: 'W4', score: 75 },
  { week: 'W5', score: 78 },
  { week: 'W6', score: 82 },
];

const chartConfig: ChartConfig = {
  score: {
    label: 'Score',
    color: '#34d399',
  },
};

export const RetentionScoreChart = () => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-base font-semibold text-gray-900">Retention Score</h3>
      </div>
      <CardContent className="pb-5">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <LineChart data={chartData}>
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
              domain={[0, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ r: 5, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
