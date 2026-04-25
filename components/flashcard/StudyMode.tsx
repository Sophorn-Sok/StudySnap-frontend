'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  X, Settings, Zap, Target, Flame, RotateCcw,
  ChevronLeft, ChevronRight, Eye, EyeOff, Shuffle,
  Trophy, ArrowLeft, CheckCircle2, Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Progress } from '../ui/progress';
import { useFlashcardStore } from '@/store';
import { Flashcard } from '@/types';

type Difficulty = 'hard' | 'medium' | 'easy';

interface StudyCard extends Flashcard {
  userRating?: Difficulty;
  isCorrect?: boolean;
}

export default function FlashcardStudyMode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deckId');

  const { decks, fetchDecks, startStudySession, completeStudySession } = useFlashcardStore();

  const [studyCards, setStudyCards] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, Difficulty>>({});
  const [startTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const deck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchDecks();
      setIsLoading(false);
    };
    void init();
  }, [fetchDecks]);

  useEffect(() => {
    if (!deck || deck.cards.length === 0) return;
    setStudyCards([...deck.cards]);
    const initSession = async () => {
      try {
        const session = await startStudySession(deck.id);
        setSessionId(session.id);
      } catch { /* session start is best-effort */ }
    };
    void initSession();
  }, [deck, startStudySession]);

  const currentCard = studyCards[currentIndex];
  const progressPercent = studyCards.length > 0 ? ((currentIndex + 1) / studyCards.length) * 100 : 0;
  const ratedCount = Object.keys(ratings).length;

  const stats = useMemo(() => {
    const easy = Object.values(ratings).filter(r => r === 'easy').length;
    const medium = Object.values(ratings).filter(r => r === 'medium').length;
    const hard = Object.values(ratings).filter(r => r === 'hard').length;
    return { easy, medium, hard };
  }, [ratings]);

  const accuracy = useMemo(() => {
    if (ratedCount === 0) return 100;
    return Math.round((stats.easy / ratedCount) * 100);
  }, [ratedCount, stats.easy]);

  const handleFlip = useCallback(() => setIsFlipped(prev => !prev), []);

  const handleRate = useCallback((rating: Difficulty) => {
    if (!currentCard) return;
    setRatings(prev => ({ ...prev, [currentCard.id]: rating }));
    setIsFlipped(false);

    if (currentIndex < studyCards.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      setTimeout(() => setIsComplete(true), 300);
    }
  }, [currentCard, currentIndex, studyCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < studyCards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, studyCards.length]);

  const handleShuffle = useCallback(() => {
    const shuffledCards = [...studyCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRatings({});
    setShuffled(true);
  }, [studyCards]);

  const handleRestart = useCallback(() => {
    if (!deck) return;
    setStudyCards([...deck.cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
    setRatings({});
    setShuffled(false);
  }, [deck]);

  const handleFinish = useCallback(async () => {
    if (sessionId) {
      try {
        await completeStudySession(sessionId, stats.easy);
      } catch { /* completion is best-effort */ }
    }
    router.push('/flashcards');
  }, [sessionId, stats.easy, completeStudySession, router]);

  const handleClose = useCallback(() => router.push('/flashcards'), [router]);

  const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleFlip(); }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === '1') handleRate('hard');
      if (e.key === '2') handleRate('medium');
      if (e.key === '3') handleRate('easy');
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleFlip, handlePrev, handleNext, handleRate, handleClose]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-3 border-blue-200 border-t-blue-600 animate-spin" />
          <p className="text-sm text-slate-500">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (!deck || deck.cards.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <EyeOff size={28} className="text-slate-400" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-slate-800">No cards to study</h2>
          <p className="mb-6 text-sm text-slate-500">Add some cards to your deck first, then come back to study.</p>
          <Button onClick={() => router.push('/flashcards')}>
            <ArrowLeft size={16} /> Back to Flashcards
          </Button>
        </div>
      </div>
    );
  }

  // --- COMPLETION SCREEN ---
  if (isComplete) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200">
            <Trophy size={36} className="text-white" />
          </div>
          <h2 className="mb-1 text-2xl font-bold text-slate-900">Session Complete!</h2>
          <p className="mb-6 text-slate-500">{deck.title} — {studyCards.length} cards studied</p>

          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-2xl font-bold text-emerald-600">{stats.easy}</p>
              <p className="text-xs font-medium text-emerald-700">Easy</p>
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
              <p className="text-2xl font-bold text-amber-600">{stats.medium}</p>
              <p className="text-xs font-medium text-amber-700">Medium</p>
            </div>
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
              <p className="text-2xl font-bold text-red-500">{stats.hard}</p>
              <p className="text-xs font-medium text-red-600">Hard</p>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><Target size={16} className="text-blue-500" /> {accuracy}% accuracy</span>
            <span className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-500" /> {elapsedMinutes} min</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw size={16} /> Study Again
            </Button>
            <Button onClick={handleFinish}>
              <CheckCircle2 size={16} /> Finish
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN STUDY SCREEN ---
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-sm px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <Zap size={16} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">{deck.title}</h1>
            <p className="text-xs text-slate-400">{currentIndex + 1} / {studyCards.length} cards</p>
          </div>
        </div>

        <div className="hidden sm:block flex-1 max-w-md mx-8">
          <Progress value={progressPercent} className="h-2 bg-slate-100" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="border-b border-slate-200/60 bg-white px-5 py-3 flex items-center gap-4 text-sm animate-in slide-in-from-top-2 duration-200">
          <Button variant="outline" size="sm" onClick={handleShuffle}>
            <Shuffle size={14} /> {shuffled ? 'Reshuffled' : 'Shuffle Cards'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw size={14} /> Restart
          </Button>
        </div>
      )}

      {/* Main content row: card area + stats panel */}
      <div className="flex flex-1 min-h-0">
        {/* Card area — centers between sidebar and stats panel */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Flashcard */}
            <div
              onClick={handleFlip}
              className="group relative mx-auto cursor-pointer select-none"
              style={{ perspective: '1200px' }}
            >
              <div
                className="relative transition-transform duration-500 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/50 min-h-[280px] flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-500">
                    Question
                  </span>
                  <p className="text-center text-xl font-semibold text-slate-800 leading-relaxed max-w-lg">
                    {currentCard?.front}
                  </p>
                  <button
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-200/50 hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
                    onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                  >
                    <Eye size={16} /> Show Answer
                  </button>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/30 p-8 shadow-lg shadow-emerald-100/40 min-h-[280px] flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="mb-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
                    Answer
                  </span>
                  <p className="text-center text-xl font-semibold text-slate-800 leading-relaxed max-w-lg">
                    {currentCard?.back}
                  </p>
                  <button
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
                    onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                  >
                    <EyeOff size={16} /> Hide Answer
                  </button>
                </div>
              </div>
            </div>

            {/* Rating buttons */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => handleRate('hard')}
                className="flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 hover:scale-105"
              >
                Hard
                <span className="text-[10px] font-normal opacity-60 ml-1">1</span>
              </button>
              <button
                onClick={() => handleRate('medium')}
                className="flex items-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200 hover:scale-105"
              >
                Medium
                <span className="text-[10px] font-normal opacity-60 ml-1">2</span>
              </button>
              <button
                onClick={() => handleRate('easy')}
                className="flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:scale-105"
              >
                Easy
                <span className="text-[10px] font-normal opacity-60 ml-1">3</span>
              </button>
            </div>

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs text-slate-400 font-medium tabular-nums">
                {currentIndex + 1} of {studyCards.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentIndex === studyCards.length - 1}
                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Keyboard hint — inside the card column so it centers with the card */}
            <div className="mt-6 hidden sm:flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px]">Space</kbd> Flip</span>
              <span><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px]">←</kbd><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] ml-0.5">→</kbd> Navigate</span>
              <span><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px]">1</kbd><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] ml-0.5">2</kbd><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] ml-0.5">3</kbd> Rate</span>
              <span><kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> Exit</span>
            </div>
          </div>
        </div>

        {/* Right stats panel — part of the flexbox flow so card area centers properly */}
        <aside className="hidden xl:flex w-64 shrink-0 flex-col border-l border-slate-200/60 bg-white/90 backdrop-blur-sm p-5 overflow-y-auto">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Study Stats</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Zap size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Remaining</p>
                <p className="text-lg font-bold text-slate-800">{studyCards.length - ratedCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
                <Target size={18} className="text-rose-500" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Accuracy</p>
                <p className="text-lg font-bold text-slate-800">{accuracy}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                <Flame size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Progress</p>
                <p className="text-lg font-bold text-slate-800">{ratedCount}/{studyCards.length}</p>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-slate-100" />

          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Ratings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-600 font-medium">Easy</span>
              <span className="font-bold text-emerald-600">{stats.easy}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-600 font-medium">Medium</span>
              <span className="font-bold text-amber-600">{stats.medium}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-500 font-medium">Hard</span>
              <span className="font-bold text-red-500">{stats.hard}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
