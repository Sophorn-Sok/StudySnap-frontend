'use client';

import { useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useFlashcardStore, useMeetingsStore, useNotesStore } from '@/store';
import {
  WelcomeHeader,
  QuickActions,
  RecentNotes,
  FlashcardProgress,
  UpcomingMeetings,
  StudyAnalytics,
} from '@/components/dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    notes,
    fetchNotes,
    isLoading: notesLoading,
  } = useNotesStore();

  const {
    decks,
    fetchDecks,
    isLoading: decksLoading,
  } = useFlashcardStore();

  const {
    meetings,
    fetchMeetings,
    isLoading: meetingsLoading,
  } = useMeetingsStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      await Promise.all([fetchNotes(), fetchDecks(), fetchMeetings()]);
    };

    void loadDashboardData();
  }, [fetchNotes, fetchDecks, fetchMeetings]);

  const userName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.username || 'VICHEA User';

  const meetingsToday = useMemo(() => {
    const today = new Date();
    return meetings.filter((meeting) => {
      const date = new Date(meeting.createdAt);
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length;
  }, [meetings]);

  const recentNotes = useMemo(() => {
    return [...notes]
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .slice(0, 3);
  }, [notes]);

  const topDecks = useMemo(() => {
    return [...decks]
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .slice(0, 3);
  }, [decks]);

  const latestMeetings = useMemo(() => {
    return [...meetings]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 2);
  }, [meetings]);

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* Welcome Section */}
          <WelcomeHeader userName={userName} meetingsToday={meetingsToday} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column: Recent Notes and Study Analytics */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <RecentNotes notes={recentNotes} isLoading={notesLoading} />
              <StudyAnalytics meetings={meetings} notes={notes} isLoading={meetingsLoading || notesLoading} />
            </div>

            {/* Right Column: Flashcard Progress and Upcoming Meetings */}
            <div className="space-y-6 lg:space-y-8">
              <FlashcardProgress decks={topDecks} isLoading={decksLoading} />
              <UpcomingMeetings meetings={latestMeetings} isLoading={meetingsLoading} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
