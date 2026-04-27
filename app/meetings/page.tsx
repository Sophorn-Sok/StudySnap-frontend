'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Circle, Eye, FileUp, Mic, Search, Sparkles, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMeetingsStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import type { Meeting } from '@/types';

type MeetingStatus = 'completed' | 'processing' | 'live';

function formatDuration(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function deriveStatus(meeting: Meeting): MeetingStatus {
  if ((meeting.aiNotes ?? '').trim().length > 0) return 'completed';
  if ((meeting.transcript ?? '').trim().length > 0) return 'processing';
  return 'live';
}

const statusConfig: Record<MeetingStatus, { label: string; className: string; dot?: boolean }> = {
  completed: {
    label: 'Completed',
    className: 'text-emerald-600 bg-emerald-50',
  },
  processing: {
    label: 'Processing',
    className: 'text-amber-600 bg-amber-50',
  },
  live: {
    label: 'Live',
    className: 'text-red-600 bg-red-50',
    dot: true,
  },
};

function StatusBadge({ status }: { status: MeetingStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
      {cfg.dot && <Circle className="h-2 w-2 fill-red-500 text-red-500" />}
      {cfg.label}
    </span>
  );
}

export default function MeetingsPage() {
  const { user } = useAuth();
  const {
    meetings,
    isLoading,
    error,
    fetchMeetings,
    createMeeting,
    deleteMeeting,
    generateMeetingNotes,
    uploadMeetingRecording,
  } = useMeetingsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTranscript, setNewTranscript] = useState('');
  const [newDuration, setNewDuration] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    void fetchMeetings();
  }, [fetchMeetings]);

  const rows = useMemo(() => {
    return [...meetings]
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .map((meeting) => ({
        id: meeting.id,
        title: meeting.title,
        date: formatDate(meeting.createdAt),
        platform: meeting.recordingUrl ? 'Upload' : 'Manual',
        duration: formatDuration(meeting.duration),
        status: deriveStatus(meeting),
      }));
  }, [meetings]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((row) => row.title.toLowerCase().includes(q) || row.platform.toLowerCase().includes(q));
  }, [rows, searchQuery]);

  const handleCreateMeeting = async () => {
    const title = newTitle.trim();
    if (!title) {
      setLocalError('Meeting title is required.');
      return;
    }

    const parsedDuration = Number.parseInt(newDuration, 10);
    const duration = Number.isFinite(parsedDuration) ? Math.max(0, parsedDuration) : 0;

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      await createMeeting(title, newTranscript.trim(), duration);
      setNewTitle('');
      setNewTranscript('');
      setNewDuration('0');
      setShowCreateForm(false);
      setFeedback('Meeting created.');
    } catch (createError) {
      setLocalError((createError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    const shouldDelete = window.confirm('Delete this meeting?');
    if (!shouldDelete) {
      return;
    }

    setLocalError(null);
    setFeedback(null);
    try {
      await deleteMeeting(id);
      setFeedback('Meeting deleted.');
    } catch (deleteError) {
      setLocalError((deleteError as Error).message);
    }
  };

  const handleGenerateNotes = async (id: string) => {
    setLocalError(null);
    setFeedback(null);

    try {
      await generateMeetingNotes(id);
      setFeedback('AI summary generated.');
      await fetchMeetings();
    } catch (generateError) {
      setLocalError((generateError as Error).message);
    }
  };

  const handleUploadRecording = async (id: string, file: File) => {
    setLocalError(null);
    setFeedback(null);

    try {
      await uploadMeetingRecording(id, file);
      setFeedback('Recording uploaded.');
      await fetchMeetings();
    } catch (uploadError) {
      setLocalError((uploadError as Error).message);
    }
  };

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="space-y-6 p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
            {user && <p className="text-sm text-gray-600">User ID: <span className="font-mono font-semibold text-gray-800">{user.id}</span></p>}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Meetings</h2>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                onClick={() => setShowCreateForm((current) => !current)}
              >
                <Mic className="h-4 w-4" />
                Start Transcription
              </Button>
            </div>
          </div>

          {(error || localError) && <p className="text-sm text-red-600">{localError ?? error}</p>}
          {feedback && <p className="text-sm text-emerald-600">{feedback}</p>}

          {showCreateForm && (
            <Card className="rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Meeting title"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="number"
                  min={0}
                  value={newDuration}
                  onChange={(event) => setNewDuration(event.target.value)}
                  placeholder="Duration in seconds"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
                <textarea
                  value={newTranscript}
                  onChange={(event) => setNewTranscript(event.target.value)}
                  rows={4}
                  placeholder="Transcript (optional)"
                  className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateMeeting} isLoading={isSubmitting}>
                  Create Meeting
                </Button>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-5 pb-2 pt-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-gray-500">Meeting Name</th>
                    <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-gray-500">Date</th>
                    <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-gray-500">Platform</th>
                    <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-gray-500">Duration</th>
                    <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, rowIndex) => (
                      <tr key={`meeting-skeleton-${rowIndex}`} className="border-b border-gray-50">
                        {Array.from({ length: 6 }).map((_, colIndex) => (
                          <td key={`meeting-skeleton-${rowIndex}-${colIndex}`} className="px-5 py-4">
                            <Skeleton className="h-4 w-24 rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        No meetings found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50 transition-colors duration-150 hover:bg-gray-50/60">
                        <td className="px-5 py-4">
                          <Link
                            href={`/meetings/${row.id}`}
                            className="font-medium text-gray-900 transition-colors hover:text-blue-600"
                          >
                            {row.title}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">{row.date}</td>
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-600">{row.platform}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">{row.duration}</td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/meetings/${row.id}`}
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                              aria-label="View meeting"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => void handleGenerateNotes(row.id)}
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                              aria-label="Generate AI notes"
                            >
                              <Sparkles className="h-4 w-4" />
                            </button>

                            <label className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                              <FileUp className="h-4 w-4" />
                              <input
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file) {
                                    void handleUploadRecording(row.id, file);
                                  }
                                  event.currentTarget.value = '';
                                }}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => void handleDeleteMeeting(row.id)}
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete meeting"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
