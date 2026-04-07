'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMeetingsStore } from '@/store';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  FileText,
  Sparkles,
  Mic,
  Upload,
  Circle,
} from 'lucide-react';
import type { Meeting } from '@/types';

// ── helpers ──────────────────────────────────────────────────────────
type MeetingStatus = 'completed' | 'processing' | 'live';

/** Derive a display‑friendly status from data the backend already provides. */
function deriveStatus(_meeting: Meeting): MeetingStatus {
  // When the backend adds a `status` field, swap this logic out.
  // For now we randomly assign for demo purposes so the UI is populated.
  return 'completed';
}

/** Format seconds → "Xh Ymin" or "Y min". */
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}min`;
  return `${mins} min`;
}

/** Format a Date into "MMM DD, YYYY". */
function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

// ── status badge ─────────────────────────────────────────────────────
const statusConfig: Record<
  MeetingStatus,
  { label: string; className: string; dot?: boolean }
> = {
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
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}
    >
      {cfg.dot && (
        <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
      )}
      {cfg.label}
    </span>
  );
}

// ── sample data for demo when no real meetings exist ─────────────────
const SAMPLE_MEETINGS: {
  id: string;
  title: string;
  date: string;
  platform: string;
  duration: string;
  status: MeetingStatus;
}[] = [
  {
    id: '1',
    title: 'Product Strategy Q2',
    date: 'Mar 18, 2026',
    platform: 'Zoom',
    duration: '45 min',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Design Sprint Review',
    date: 'Mar 18, 2026',
    platform: 'Google Meet',
    duration: '32 min',
    status: 'processing',
  },
  {
    id: '3',
    title: 'Weekly Standup',
    date: 'Mar 19, 2026',
    platform: 'Zoom',
    duration: '15 min',
    status: 'live',
  },
  {
    id: '4',
    title: 'Client Onboarding Call',
    date: 'Mar 17, 2026',
    platform: 'Google Meet',
    duration: '58 min',
    status: 'completed',
  },
  {
    id: '5',
    title: 'Lecture - Intro to ML',
    date: 'Mar 16, 2026',
    platform: 'Upload',
    duration: '1h 20min',
    status: 'completed',
  },
  {
    id: '6',
    title: 'Research Group Sync',
    date: 'Mar 15, 2026',
    platform: 'Zoom',
    duration: '27 min',
    status: 'completed',
  },
];

// ── main page component ──────────────────────────────────────────────
export default function MeetingsPage() {
  const { meetings, isLoading, fetchMeetings } = useMeetingsStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Normalise real meetings into a unified row shape
  const rows = useMemo(() => {
    if (meetings.length > 0) {
      return meetings.map((m) => ({
        id: m.id,
        title: m.title,
        date: formatDate(m.createdAt),
        platform: m.recordingUrl ? 'Upload' : 'Zoom',
        duration: formatDuration(m.duration),
        status: deriveStatus(m),
      }));
    }
    // Fall back to sample data so the table always looks populated
    return SAMPLE_MEETINGS;
  }, [meetings]);

  // Filter rows by search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.platform.toLowerCase().includes(q),
    );
  }, [rows, searchQuery]);

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-6 md:p-8 space-y-6">
          {/* ── Page title ───────────────────────────────────── */}
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>

          {/* ── Toolbar ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Meetings
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="default"
                className="bg-blue-100 text-blue-600 hover:bg-blue-200 h-7 px-4 text-sm font-medium"
              >
                <Mic className="w-4 h-4" />
                Start Transcription
              </Button>
              <Button
                variant="outline"
                size="default"
                className="text-gray-700 border-gray-200 hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Upload Recording
              </Button>
            </div>
          </div>

          {/* ── Search bar (within table card) ────────────────────── */}
          <Card className="overflow-hidden">
            {/* Search */}
            <div className="px-5 pt-4 pb-2">
              <InputGroup className="h-10 max-w-xs border-gray-200 bg-gray-50 rounded-lg">
                <InputGroupAddon>
                  <Search className="w-4 h-4 text-gray-400" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 placeholder:text-gray-400"
                />
              </InputGroup>
            </div>

            {/* ── Table ────────────────────────────────────────── */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 px-5 py-3 whitespace-nowrap">
                      Meeting Name
                    </th>
                    <th className="text-left font-medium text-gray-500 px-5 py-3 whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-left font-medium text-gray-500 px-5 py-3 whitespace-nowrap">
                      Platform
                    </th>
                    <th className="text-left font-medium text-gray-500 px-5 py-3 whitespace-nowrap">
                      Duration
                    </th>
                    <th className="text-left font-medium text-gray-500 px-5 py-3 whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-right font-medium text-gray-500 px-5 py-3 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    // Skeleton loading rows
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={`skeleton-${i}`}
                        className="border-b border-gray-50"
                      >
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <Skeleton className="h-4 w-24 rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-500"
                      >
                        No meetings found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/meetings/${row.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {row.title}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                          {row.date}
                        </td>
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap font-medium">
                          {row.platform}
                        </td>
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                          {row.duration}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    aria-label="View meeting"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>View</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    aria-label="View notes"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Notes</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    aria-label="Generate AI summary"
                                  >
                                    <Sparkles className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>AI Generate</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
