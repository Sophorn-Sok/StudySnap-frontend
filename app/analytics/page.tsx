'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useFlashcardStore, useMeetingsStore, useNotesStore } from '@/store';
import type { Flashcard, FlashcardDeck, StudySession } from '@/types';
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

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  const weekday = value.getDay();
  const delta = weekday === 0 ? 6 : weekday - 1;
  value.setDate(value.getDate() - delta);
  return value;
}

function sessionDurationSeconds(session: StudySession) {
  const started = new Date(session.startedAt).getTime();
  const ended = session.endedAt ? new Date(session.endedAt).getTime() : NaN;
  const derived = Number.isFinite(started) && Number.isFinite(ended) && ended > started
    ? Math.floor((ended - started) / 1000)
    : 0;

  if (derived > 0) {
    return derived;
  }

  return Math.max(0, session.cardsStudied) * 45;
}

function deckMastery(deck: FlashcardDeck) {
  if (deck.cards.length === 0) {
    return 0;
  }

  const score = deck.cards.reduce((sum, card) => sum + Math.min(card.reviewCount * 20, 100), 0);
  return Math.round(score / deck.cards.length);
}

function difficultyLabel(card: Flashcard): 'Hard' | 'Medium' | 'Easy' {
  if (card.difficulty === 'hard') return 'Hard';
  if (card.difficulty === 'medium') return 'Medium';
  return 'Easy';
}

export default function AnalyticsPage() {
  const router = useRouter();

  const {
    notes,
    fetchNotes,
    isLoading: notesLoading,
  } = useNotesStore();

  const {
    decks,
    studySessions,
    fetchDecks,
    fetchStudySessions,
    isLoading: flashcardsLoading,
  } = useFlashcardStore();

  const {
    meetings,
    fetchMeetings,
    isLoading: meetingsLoading,
  } = useMeetingsStore();

  useEffect(() => {
    const loadAnalytics = async () => {
      await Promise.all([fetchNotes(), fetchDecks(), fetchStudySessions(), fetchMeetings()]);
    };

    void loadAnalytics();
  }, [fetchNotes, fetchDecks, fetchStudySessions, fetchMeetings]);

  const loading = notesLoading || flashcardsLoading || meetingsLoading;

  const allCards = useMemo(() => decks.flatMap((deck) => deck.cards), [decks]);

  const totalStudyHours = useMemo(() => {
    const meetingSeconds = meetings.reduce((sum, meeting) => sum + Math.max(0, meeting.duration), 0);
    const sessionSeconds = studySessions.reduce((sum, session) => sum + sessionDurationSeconds(session), 0);
    return (meetingSeconds + sessionSeconds) / 3600;
  }, [meetings, studySessions]);

  const flashcardAccuracy = useMemo(() => {
    const totals = studySessions.reduce(
      (acc, session) => {
        acc.correct += Math.max(0, session.correctAnswers);
        acc.studied += Math.max(0, session.cardsStudied);
        return acc;
      },
      { correct: 0, studied: 0 }
    );

    if (totals.studied === 0) {
      return 0;
    }

    return Math.round((totals.correct / totals.studied) * 100);
  }, [studySessions]);

  const deckMasteryData = useMemo(() => {
    return decks.map((deck) => ({
      name: deck.title,
      percentage: deckMastery(deck),
    }));
  }, [decks]);

  const masteredDecks = useMemo(
    () => deckMasteryData.filter((deck) => deck.percentage >= 80).length,
    [deckMasteryData]
  );

  const retentionScore = useMemo(() => {
    if (deckMasteryData.length === 0) {
      return 0;
    }

    const total = deckMasteryData.reduce((sum, deck) => sum + deck.percentage, 0);
    return Math.round(total / deckMasteryData.length);
  }, [deckMasteryData]);

  const studyActivityData = useMemo(() => {
    const days = 30;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const byDay = new Map<string, { date: string; flashcards: number; reviews: number }>();
    for (let index = 0; index < days; index += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + index);
      const key = toDateKey(current);
      byDay.set(key, { date: key, flashcards: 0, reviews: 0 });
    }

    for (const session of studySessions) {
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      const key = toDateKey(sessionDate);
      const existing = byDay.get(key);
      if (!existing) {
        continue;
      }

      existing.flashcards += Math.max(0, session.cardsStudied);
      existing.reviews += Math.max(0, session.correctAnswers);
    }

    return [...byDay.values()];
  }, [studySessions]);

  const weeklyAccuracyData = useMemo(() => {
    const currentWeek = startOfWeek(new Date());
    const buckets = Array.from({ length: 6 }).map((_, index) => {
      const start = new Date(currentWeek);
      start.setDate(currentWeek.getDate() - (5 - index) * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return { start, end, label: `W${index + 1}` };
    });

    return buckets.map((bucket) => {
      const inWeek = studySessions.filter((session) => {
        const date = new Date(session.startedAt).getTime();
        return date >= bucket.start.getTime() && date < bucket.end.getTime();
      });

      const totals = inWeek.reduce(
        (acc, session) => {
          acc.correct += Math.max(0, session.correctAnswers);
          acc.studied += Math.max(0, session.cardsStudied);
          return acc;
        },
        { correct: 0, studied: 0 }
      );

      const correct = totals.studied > 0 ? Math.round((totals.correct / totals.studied) * 100) : 0;
      return {
        week: bucket.label,
        correct,
        incorrect: totals.studied > 0 ? Math.max(0, 100 - correct) : 0,
      };
    });
  }, [studySessions]);

  const retentionTrendData = useMemo(() => {
    return weeklyAccuracyData.map((point) => ({
      week: point.week,
      score: point.correct > 0 ? point.correct : retentionScore,
    }));
  }, [weeklyAccuracyData, retentionScore]);

  const weeklySummaryData = useMemo(() => {
    const currentWeekStart = startOfWeek(new Date());
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 7);

    const sessionsCurrentWeek = studySessions.filter((session) => {
      const timestamp = new Date(session.startedAt).getTime();
      return timestamp >= currentWeekStart.getTime() && timestamp < currentWeekEnd.getTime();
    });
    const sessionsPreviousWeek = studySessions.filter((session) => {
      const timestamp = new Date(session.startedAt).getTime();
      return timestamp >= previousWeekStart.getTime() && timestamp < currentWeekStart.getTime();
    });

    const currentWeekNotes = notes.filter((note) => {
      const timestamp = new Date(note.updatedAt).getTime();
      return timestamp >= currentWeekStart.getTime() && timestamp < currentWeekEnd.getTime();
    });

    const currentWeekMeetings = meetings.filter((meeting) => {
      const timestamp = new Date(meeting.createdAt).getTime();
      return timestamp >= currentWeekStart.getTime() && timestamp < currentWeekEnd.getTime();
    });

    const currentDays = new Set<string>();
    for (const session of sessionsCurrentWeek) {
      currentDays.add(toDateKey(new Date(session.startedAt)));
    }
    for (const note of currentWeekNotes) {
      currentDays.add(toDateKey(new Date(note.updatedAt)));
    }
    for (const meeting of currentWeekMeetings) {
      currentDays.add(toDateKey(new Date(meeting.createdAt)));
    }

    const toAccuracy = (sessions: StudySession[]) => {
      const totals = sessions.reduce(
        (acc, session) => {
          acc.correct += Math.max(0, session.correctAnswers);
          acc.studied += Math.max(0, session.cardsStudied);
          return acc;
        },
        { correct: 0, studied: 0 }
      );

      if (totals.studied === 0) {
        return 0;
      }

      return Math.round((totals.correct / totals.studied) * 100);
    };

    const reviewedCards = sessionsCurrentWeek.reduce(
      (sum, session) => sum + Math.max(0, session.cardsStudied),
      0
    );

    return {
      studiedDays: currentDays.size,
      accuracyDelta: toAccuracy(sessionsCurrentWeek) - toAccuracy(sessionsPreviousWeek),
      reviewedCards,
    };
  }, [studySessions, notes, meetings]);

  const struggleCards = useMemo(() => {
    return [...allCards]
      .sort((left, right) => {
        const difficultyWeight = (card: Flashcard) => {
          if (card.difficulty === 'hard') return 3;
          if (card.difficulty === 'medium') return 2;
          return 1;
        };

        const score = (card: Flashcard) => difficultyWeight(card) * 100 - card.reviewCount * 20;
        return score(right) - score(left);
      })
      .slice(0, 5)
      .map((card) => ({
        question: card.front,
        difficulty: difficultyLabel(card),
      }));
  }, [allCards]);

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6">
          {/* Header with time range selector */}
          <AnalyticsHeader />

          {/* Stat Cards */}
          <StatCards
            totalStudyHours={totalStudyHours}
            flashcardAccuracy={flashcardAccuracy}
            retentionScore={retentionScore}
            masteredDecks={masteredDecks}
            totalDecks={decks.length}
          />

          {/* Weekly Study Activity Chart */}
          <WeeklyStudyActivity chartData={studyActivityData} isLoading={loading} />

          {/* Flashcard Accuracy + Retention Score side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FlashcardAccuracyChart chartData={weeklyAccuracyData} isLoading={loading} />
            <RetentionScoreChart chartData={retentionTrendData} isLoading={loading} />
          </div>

          {/* Deck Mastery + Cards You Struggle With side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeckMastery decks={deckMasteryData} isLoading={loading} />
            <CardsYouStruggleWith
              cards={struggleCards}
              isLoading={loading}
              onReviewCard={() => router.push('/flashcards')}
            />
          </div>

          {/* Weekly Summary */}
          <WeeklySummary
            studiedDays={weeklySummaryData.studiedDays}
            accuracyDelta={weeklySummaryData.accuracyDelta}
            reviewedCards={weeklySummaryData.reviewedCards}
          />
        </div>
      </DashboardLayout>
    </>
  );
}
