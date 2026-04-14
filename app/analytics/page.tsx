'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import {
  AnalyticsHeader,
  StatCards,
  WeeklyStudyActivity,
  FlashcardAccuracyChart,
  RetentionScoreChart,
  DeckMastery,
  CardsYouStruggleWith,
  WeeklySummary,
} from '@/components/analytics';

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6">
          {/* Header with time range selector */}
          <AnalyticsHeader />

          {/* Stat Cards */}
          <StatCards />

          {/* Weekly Study Activity Chart */}
          <WeeklyStudyActivity />

          {/* Flashcard Accuracy + Retention Score side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FlashcardAccuracyChart />
            <RetentionScoreChart />
          </div>

          {/* Deck Mastery + Cards You Struggle With side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeckMastery />
            <CardsYouStruggleWith />
          </div>

          {/* Weekly Summary */}
          <WeeklySummary />
        </div>
      </DashboardLayout>
    </>
  );
}
