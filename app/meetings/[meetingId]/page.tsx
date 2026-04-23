'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  Download,
  ListChecks,
  Save,
  Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMeetingsStore } from '@/store';

type TranscriptEntry = {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
};

function formatTimer(totalSeconds: number): string {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
  const hrs = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(safeSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function toTranscriptEntries(text: string): TranscriptEntry[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return [];
  }

  const sourceLines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const lines = sourceLines.length > 1
    ? sourceLines
    : normalized
        .split(/(?<=[.!?])\s+/)
        .map((line) => line.trim())
        .filter(Boolean);

  return lines.map((line, index) => {
    const matched = line.match(/^([^:]{1,24}):\s*(.+)$/);
    const speaker = matched ? matched[1] : `Speaker ${(index % 2) + 1}`;
    const textContent = matched ? matched[2] : line;
    const timestamp = formatTimer(index * 20);

    return {
      id: `line-${index}`,
      speaker,
      timestamp,
      text: textContent,
    };
  });
}

function parseAiNotes(notes: string) {
  const normalized = notes.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return {
      summary: 'No AI summary generated yet.',
      keyPoints: [] as string[],
      actionItems: [] as string[],
    };
  }

  const lower = normalized.toLowerCase();
  const keyIndex = lower.indexOf('key points:');
  const actionIndex = lower.indexOf('action items:');

  const summaryEnd = keyIndex >= 0 ? keyIndex : actionIndex >= 0 ? actionIndex : normalized.length;
  const summary = normalized.slice(0, summaryEnd).trim() || 'No summary found.';

  const keySection = keyIndex >= 0
    ? normalized.slice(keyIndex + 'key points:'.length, actionIndex >= 0 ? actionIndex : normalized.length)
    : '';
  const actionSection = actionIndex >= 0
    ? normalized.slice(actionIndex + 'action items:'.length)
    : '';

  const bulletLines = (section: string) =>
    section
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);

  return {
    summary,
    keyPoints: bulletLines(keySection),
    actionItems: bulletLines(actionSection),
  };
}

export default function MeetingTranscriptPage() {
  const params = useParams();
  const meetingId = params.meetingId as string;

  const {
    selectedMeeting,
    isLoading,
    error,
    fetchMeetingById,
    refreshMeetingById,
    updateMeeting,
    generateMeetingNotes,
  } = useMeetingsStore();

  const [editableAiNotes, setEditableAiNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (meetingId) {
      void fetchMeetingById(meetingId);
    }
  }, [meetingId, fetchMeetingById]);

  useEffect(() => {
    if (!meetingId) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshMeetingById(meetingId);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [meetingId, refreshMeetingById]);

  useEffect(() => {
    setEditableAiNotes(selectedMeeting?.aiNotes ?? '');
  }, [selectedMeeting]);

  const transcriptEntries = useMemo(
    () => toTranscriptEntries(selectedMeeting?.transcript ?? ''),
    [selectedMeeting?.transcript]
  );

  const parsedNotes = useMemo(() => parseAiNotes(editableAiNotes), [editableAiNotes]);

  const handleGenerateSummary = async () => {
    if (!meetingId) {
      return;
    }

    setIsGenerating(true);
    setLocalError(null);
    setFeedback(null);

    try {
      const generated = await generateMeetingNotes(meetingId);
      const notesText = `${generated.summary}\n\nKey points:\n- ${generated.keyPoints.join('\n- ')}\n\nAction items:\n- ${generated.actionItems.join('\n- ')}`;
      setEditableAiNotes(notesText);
      setFeedback('AI summary generated.');
      await fetchMeetingById(meetingId);
    } catch (generateError) {
      setLocalError((generateError as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!meetingId) {
      return;
    }

    setIsSaving(true);
    setLocalError(null);
    setFeedback(null);

    try {
      await updateMeeting(meetingId, { aiNotes: editableAiNotes });
      setFeedback('AI notes saved.');
    } catch (saveError) {
      setLocalError((saveError as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!selectedMeeting) {
      return;
    }

    const content = [
      `Title: ${selectedMeeting.title}`,
      `Duration: ${formatTimer(selectedMeeting.duration)}`,
      '',
      'Transcript:',
      selectedMeeting.transcript || 'No transcript available.',
      '',
      'AI Notes:',
      editableAiNotes || 'No AI notes available.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${selectedMeeting.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}_meeting.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const statusLabel = selectedMeeting
    ? (selectedMeeting.aiNotes?.trim() ? 'Completed' : selectedMeeting.transcript?.trim() ? 'Processing' : 'Live')
    : 'Loading';

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="flex h-full flex-col overflow-hidden bg-gray-50">
          <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                {selectedMeeting?.title ?? 'Meeting Transcript'}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                <Circle className="h-2.5 w-2.5 fill-red-500 text-red-500" />
                {statusLabel}
              </span>
              <span className="text-sm font-medium tabular-nums text-gray-500">
                {formatTimer(selectedMeeting?.duration ?? 0)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/meetings">
                <Button variant="outline" size="sm">Back</Button>
              </Link>
              <Button size="sm" onClick={handleGenerateSummary} isLoading={isGenerating}>
                <Sparkles className="h-4 w-4" />
                Generate AI Summary
              </Button>
            </div>
          </header>

          {(error || localError) && <p className="px-6 pt-3 text-sm text-red-600">{localError ?? error}</p>}
          {feedback && <p className="px-6 pt-3 text-sm text-emerald-600">{feedback}</p>}

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-hidden p-5 lg:grid-cols-[1fr_380px]">
            <div className="flex min-h-0 overflow-hidden">
              <Card className="flex flex-1 flex-col overflow-hidden shadow-sm!">
                <div className="shrink-0 px-6 pb-4 pt-5">
                  <h2 className="text-base font-bold text-gray-900">Transcript</h2>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
                  {isLoading ? (
                    <p className="text-sm text-gray-500">Loading meeting...</p>
                  ) : transcriptEntries.length === 0 ? (
                    <p className="text-sm text-gray-500">No transcript available for this meeting.</p>
                  ) : (
                    transcriptEntries.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                          {entry.speaker.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{entry.speaker}</span>
                            <span className="text-xs tabular-nums text-gray-400">{entry.timestamp}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-600">{entry.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <div className="flex min-h-0 overflow-hidden">
              <Card className="flex flex-1 flex-col overflow-hidden shadow-sm!">
                <div className="shrink-0 px-5 pb-4 pt-5">
                  <h2 className="text-base font-bold text-gray-900">AI Summary</h2>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5">
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">Summary</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{parsedNotes.summary}</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">Key Points</h3>
                    {parsedNotes.keyPoints.length === 0 ? (
                      <p className="text-sm text-gray-500">No key points yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {parsedNotes.keyPoints.map((item, index) => (
                          <li key={`key-point-${index}`} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">Action Items</h3>
                    {parsedNotes.actionItems.length === 0 ? (
                      <p className="text-sm text-gray-500">No action items yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {parsedNotes.actionItems.map((item, index) => (
                          <li key={`action-item-${index}`} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-gray-900">Raw AI Notes</h3>
                    </div>
                    <textarea
                      value={editableAiNotes}
                      onChange={(event) => setEditableAiNotes(event.target.value)}
                      rows={10}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    />
                  </section>
                </div>
              </Card>
            </div>
          </div>

          <footer className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-white px-6 py-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleSaveNotes} isLoading={isSaving}>
                <Save className="h-4 w-4" />
                Save Notes
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <Link href="/flashcards">
              <Button size="sm">
                <Sparkles className="h-4 w-4" />
                Generate Flashcards
              </Button>
            </Link>
          </footer>
        </div>
      </DashboardLayout>
    </>
  );
}
