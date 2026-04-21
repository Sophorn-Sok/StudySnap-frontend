'use client';

import { Card } from '@/components/ui/Card';
import { Clock, Target, Brain, BookOpen } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  value: string;
  label: string;
}

interface StatCardsProps {
  totalStudyHours: number;
  flashcardAccuracy: number;
  retentionScore: number;
  masteredDecks: number;
  totalDecks: number;
}

const StatCard = ({ icon, iconBgColor, value, label }: StatCardProps) => (
  <Card className="p-5 shadow-sm border border-gray-100">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconBgColor}`}>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </Card>
);

export const StatCards = ({
  totalStudyHours,
  flashcardAccuracy,
  retentionScore,
  masteredDecks,
  totalDecks,
}: StatCardsProps) => {
  const stats: StatCardProps[] = [
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      iconBgColor: 'bg-blue-50',
      value: `${totalStudyHours.toFixed(1)}h`,
      label: 'Total Study Time',
    },
    {
      icon: <Target className="w-5 h-5 text-amber-600" />,
      iconBgColor: 'bg-amber-50',
      value: `${flashcardAccuracy}%`,
      label: 'Flashcard Accuracy',
    },
    {
      icon: <Brain className="w-5 h-5 text-green-600" />,
      iconBgColor: 'bg-green-50',
      value: `${retentionScore}%`,
      label: 'Retention Score',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-purple-600" />,
      iconBgColor: 'bg-purple-50',
      value: `${masteredDecks}/${totalDecks}`,
      label: 'Deck Mastery',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
