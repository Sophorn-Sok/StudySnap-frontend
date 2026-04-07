'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import {
  WelcomeHeader,
  QuickActions,
  RecentNotes,
  FlashcardProgress,
  UpcomingMeetings,
  StudyAnalytics,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-8 max-w-7xl">
          {/* Welcome Section */}
          <WelcomeHeader />

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Notes and Study Analytics */}
            <div className="lg:col-span-2 space-y-8">
              <RecentNotes />
              <StudyAnalytics />
            </div>

            {/* Right Column: Flashcard Progress and Upcoming Meetings */}
            <div className="space-y-8">
              <FlashcardProgress />
              <UpcomingMeetings />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
