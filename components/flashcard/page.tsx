'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Clock3, Play, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useFlashcardStore } from '@/store';
import { Flashcard, StudySession, Meeting } from '@/types';
import { getRelativeTime } from '@/utils/helpers';
import { meetingsService } from '@/services/meetings.api';

export default function FlashcardsPageContent() {
  const router = useRouter();
  const {
    decks,
    selectedDeck,
    isLoading,
    error,
    fetchDecks,
    createDeck,
    deleteDeck,
    addCard,
    generateDeckFromMeeting,
    deleteCard,
    startStudySession,
    completeStudySession,
    setSelectedDeck,
  } = useFlashcardStore();

  const [query, setQuery] = useState('');
  const [showCreateDeckForm, setShowCreateDeckForm] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardDifficulty, setNewCardDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [correctAnswersInput, setCorrectAnswersInput] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiKeyPoints, setAiKeyPoints] = useState<string[]>([]);

  useEffect(() => {
    void fetchDecks();
  }, [fetchDecks]);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const items = await meetingsService.getMeetings();
        setMeetings(items);
        if (items.length > 0) {
          setSelectedMeetingId((current) => current || items[0].id);
        }
      } catch {
        // Meeting fetch errors are surfaced when generating AI deck.
      }
    };

    void loadMeetings();
  }, []);

  useEffect(() => {
    if (!selectedDeck && decks.length > 0) {
      setSelectedDeck(decks[0]);
      return;
    }

    if (selectedDeck && !decks.some((deck) => deck.id === selectedDeck.id)) {
      setSelectedDeck(decks[0] ?? null);
      setActiveSession(null);
    }
  }, [decks, selectedDeck, setSelectedDeck]);

  const activeDeck = useMemo(() => {
    if (!selectedDeck) {
      return null;
    }

    return decks.find((deck) => deck.id === selectedDeck.id) ?? selectedDeck;
  }, [decks, selectedDeck]);

  const filteredDecks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return decks;
    }

    return decks.filter((deck) => {
      const searchable = `${deck.title} ${deck.description ?? ''}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [decks, query]);

  const stats = useMemo(() => {
    const allCards = decks.flatMap((deck) => deck.cards);
    const totalCards = allCards.length;
    const masteredCards = allCards.filter((card) => card.reviewCount >= 5).length;
    const dueCards = allCards.filter((card) => card.reviewCount < 2).length;

    return {
      totalDecks: decks.length,
      totalCards,
      masteredCards,
      dueCards,
    };
  }, [decks]);

  const deckMastery = (deckCards: Flashcard[]) => {
    if (deckCards.length === 0) {
      return 0;
    }

    const score = deckCards.reduce((total, card) => total + Math.min(card.reviewCount * 20, 100), 0);
    return Math.round(score / deckCards.length);
  };

  const handleCreateDeck = async () => {
    const title = newDeckTitle.trim();
    if (!title) {
      setLocalError('Deck title is required.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      const created = await createDeck(title, newDeckDescription.trim() || undefined);
      setSelectedDeck(created);
      setNewDeckTitle('');
      setNewDeckDescription('');
      setShowCreateDeckForm(false);
      setFeedback('Deck created successfully.');
    } catch (createError) {
      setLocalError((createError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!activeDeck) {
      return;
    }

    const shouldDelete = window.confirm(`Delete deck "${activeDeck.title}"? This also removes all cards in the deck.`);
    if (!shouldDelete) {
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      const nextDeck = decks.find((deck) => deck.id !== activeDeck.id) ?? null;
      await deleteDeck(activeDeck.id);
      setSelectedDeck(nextDeck);
      setActiveSession(null);
      setFeedback('Deck deleted.');
    } catch (deleteError) {
      setLocalError((deleteError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCard = async () => {
    if (!activeDeck) {
      return;
    }

    const front = newCardFront.trim();
    const back = newCardBack.trim();

    if (!front || !back) {
      setLocalError('Both front and back content are required.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      await addCard(activeDeck.id, front, back, newCardDifficulty);
      setNewCardFront('');
      setNewCardBack('');
      setNewCardDifficulty('easy');
      setFeedback('Card added to deck.');
    } catch (addError) {
      setLocalError((addError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudyNow = async () => {
    if (!activeDeck) return;

    const front = newCardFront.trim();
    const back = newCardBack.trim();

    // If user has filled in card fields, add the card first
    if (front && back) {
      setIsSubmitting(true);
      setLocalError(null);
      try {
        await addCard(activeDeck.id, front, back, newCardDifficulty);
        setNewCardFront('');
        setNewCardBack('');
        setNewCardDifficulty('easy');
      } catch (addError) {
        setLocalError((addError as Error).message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    router.push(`/flashcards/study?deckId=${activeDeck.id}`);
  };

  const handleGenerateDeckFromTranscript = async () => {
    if (!selectedMeetingId) {
      setLocalError('Select a meeting transcript first.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      const generated = await generateDeckFromMeeting(selectedMeetingId);
      setAiSummary(generated.summary);
      setAiKeyPoints(generated.keyPoints);
      setSelectedDeck(generated.deck);
      setFeedback(`AI deck generated with ${generated.generatedCount} cards.`);
    } catch (generationError) {
      setLocalError((generationError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async (card: Flashcard) => {
    if (!activeDeck) {
      return;
    }

    setLocalError(null);
    setFeedback(null);
    try {
      await deleteCard(activeDeck.id, card.id);
      setFeedback('Card deleted.');
    } catch (deleteError) {
      setLocalError((deleteError as Error).message);
    }
  };

  const handleStartStudy = async () => {
    if (!activeDeck) {
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      const session = await startStudySession(activeDeck.id);
      setActiveSession(session);
      setCorrectAnswersInput('0');
      setFeedback(`Study session started for ${activeDeck.title}.`);
    } catch (studyError) {
      setLocalError((studyError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteStudy = async () => {
    if (!activeSession) {
      return;
    }

    const parsed = Number.parseInt(correctAnswersInput, 10);
    const maxCards = activeDeck?.cardCount ?? 0;
    const safeCorrectAnswers = Number.isFinite(parsed) ? Math.max(0, Math.min(parsed, maxCards)) : 0;

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      await completeStudySession(activeSession.id, safeCorrectAnswers);
      setActiveSession(null);
      setCorrectAnswersInput('0');
      setFeedback('Study session completed. Great work.');
      await fetchDecks();
    } catch (completeError) {
      setLocalError((completeError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden font-sans text-slate-800">
      <aside className="w-full max-w-sm shrink-0 border-r border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Flashcards</h2>
          <Button variant="outline" size="sm" onClick={() => setShowCreateDeckForm((current) => !current)}>
            <Plus size={14} /> New Deck
          </Button>
        </div>

        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Sparkles size={14} /> AI from transcript
          </div>

          <select
            value={selectedMeetingId}
            onChange={(event) => setSelectedMeetingId(event.target.value)}
            className="mb-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          >
            {meetings.length === 0 ? (
              <option value="">No meetings found</option>
            ) : (
              meetings.map((meeting) => (
                <option key={meeting.id} value={meeting.id}>
                  {meeting.title}
                </option>
              ))
            )}
          </select>

          <Button
            size="sm"
            className="w-full"
            onClick={handleGenerateDeckFromTranscript}
            isLoading={isSubmitting}
            disabled={meetings.length === 0}
          >
            <Sparkles size={14} /> Generate AI Deck
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search decks..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {showCreateDeckForm && (
          <div className="mb-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <input
              type="text"
              value={newDeckTitle}
              onChange={(event) => setNewDeckTitle(event.target.value)}
              placeholder="Deck title"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
            <textarea
              value={newDeckDescription}
              onChange={(event) => setNewDeckDescription(event.target.value)}
              placeholder="Deck description (optional)"
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCreateDeckForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateDeck} isLoading={isSubmitting}>
                Create
              </Button>
            </div>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-slate-500">Decks</p>
            <p className="text-lg font-bold text-blue-700">{stats.totalDecks}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3">
            <p className="text-slate-500">Cards</p>
            <p className="text-lg font-bold text-indigo-700">{stats.totalCards}</p>
          </div>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Loading decks...</p>}
        {(error || localError) && <p className="mb-3 text-sm text-red-600">{localError ?? error}</p>}
        {feedback && <p className="mb-3 text-sm text-emerald-600">{feedback}</p>}

        <div className="space-y-2 overflow-y-auto pr-1">
          {!isLoading && filteredDecks.length === 0 && <p className="text-sm text-slate-500">No decks found.</p>}

          {filteredDecks.map((deck) => {
            const active = activeDeck?.id === deck.id;
            return (
              <div
                key={deck.id}
                className={`w-full rounded-xl border px-3 py-3 text-left transition cursor-pointer ${
                  active
                    ? 'border-blue-200 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setSelectedDeck(deck);
                  setActiveSession(null);
                }}
              >
                <p className="truncate text-sm font-semibold text-slate-900">{deck.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {deck.cardCount} cards · {deckMastery(deck.cards)}% mastery
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock3 size={12} />
                    {getRelativeTime(deck.updatedAt)}
                  </div>
                  {deck.cardCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/flashcards/study?deckId=${deck.id}`);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition"
                    >
                      <Play size={10} fill="currentColor" /> Study
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto bg-white p-6 lg:p-8">
        {!activeDeck ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Create or select a deck to start managing flashcards.
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{activeDeck.title}</h3>
                <p className="text-sm text-slate-500">{activeDeck.description ?? 'No description yet.'}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDeleteDeck} isLoading={isSubmitting}>
                  <Trash2 size={14} /> Delete Deck
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Cards in Deck</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{activeDeck.cardCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Mastered</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">{activeDeck.cards.filter((card) => card.reviewCount >= 5).length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Due for Review</p>
                <p className="mt-1 text-xl font-bold text-amber-600">{activeDeck.cards.filter((card) => card.reviewCount < 2).length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Sparkles size={16} className="text-blue-500" />
                Add a card to this deck
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <textarea
                  value={newCardFront}
                  onChange={(event) => setNewCardFront(event.target.value)}
                  placeholder="Front (question)"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
                <textarea
                  value={newCardBack}
                  onChange={(event) => setNewCardBack(event.target.value)}
                  placeholder="Back (answer)"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <select
                  value={newCardDifficulty}
                  onChange={(event) => setNewCardDifficulty(event.target.value as 'easy' | 'medium' | 'hard')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <Button size="sm" onClick={handleStudyNow} isLoading={isSubmitting}>
                  <Play size={14} /> Study Now
                </Button>
              </div>
            </div>

            {activeSession && activeSession.deckId === activeDeck.id && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <CheckCircle2 size={16} />
                  Active study session
                </div>
                <p className="mb-3 text-sm text-blue-700">Enter how many answers you got correct before completing this session.</p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={activeDeck.cardCount}
                    value={correctAnswersInput}
                    onChange={(event) => setCorrectAnswersInput(event.target.value)}
                    className="w-40 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                  <Button size="sm" onClick={handleCompleteStudy} isLoading={isSubmitting}>
                    Complete Session
                  </Button>
                </div>
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BookOpen size={16} className="text-indigo-500" />
                Cards ({activeDeck.cards.length})
              </div>

              <div className="space-y-3">
                {activeDeck.cards.length === 0 && (
                  <p className="text-sm text-slate-500">No cards yet. Add your first flashcard above.</p>
                )}

                {activeDeck.cards.map((card) => (
                  <article key={card.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        {card.difficulty}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Reviews: {card.reviewCount}</span>
                        <button
                          type="button"
                          onClick={() => void handleDeleteCard(card)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Q: {card.front}</p>
                    <p className="mt-1 text-sm text-slate-600">A: {card.back}</p>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => router.push(`/flashcards/study?deckId=${activeDeck.id}`)}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        <Play size={10} fill="currentColor" /> Study
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <aside className="hidden w-72 shrink-0 border-l border-slate-200 bg-white p-5 xl:block">
        <h3 className="mb-4 text-base font-bold text-slate-900">Study Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-emerald-700">Cards Mastered</p>
            <p className="text-xl font-bold text-emerald-800">{stats.masteredCards}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-amber-700">Due Today</p>
            <p className="text-xl font-bold text-amber-800">{stats.dueCards}</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-blue-700">Total Cards</p>
            <p className="text-xl font-bold text-blue-800">{stats.totalCards}</p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
            <p className="mb-1 text-indigo-700">AI Transcript Summary</p>
            <p className="text-xs text-indigo-900">
              {aiSummary || 'Generate an AI deck from a meeting transcript to see the summary here.'}
            </p>
            {aiKeyPoints.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-indigo-900">
                {aiKeyPoints.slice(0, 4).map((point, index) => (
                  <li key={`ai-key-point-${index}`}>• {point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
