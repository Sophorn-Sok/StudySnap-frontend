'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMeetingsStore } from '@/store';
import {
  Circle,
  Settings,
  Save,
  Download,
  Sparkles,
  Key,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────
interface TranscriptEntry {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  highlights?: string[];
}

interface KeyPoint {
  text: string;
}

interface Decision {
  text: string;
}

interface ActionItem {
  text: string;
  assignee: string;
}

// ── Speaker colors ───────────────────────────────────────────────────
const SPEAKER_COLORS: Record<string, { bg: string; text: string }> = {
  John: { bg: 'bg-blue-500', text: 'text-white' },
  Sarah: { bg: 'bg-emerald-500', text: 'text-white' },
  Alex: { bg: 'bg-purple-500', text: 'text-white' },
  Lisa: { bg: 'bg-amber-500', text: 'text-white' },
};

function getSpeakerColor(name: string) {
  return SPEAKER_COLORS[name] || { bg: 'bg-gray-400', text: 'text-white' };
}

// ── Format elapsed time "HH:MM:SS" ──────────────────────────────────
function formatTimer(totalSeconds: number): string {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// ── Highlight keywords in transcript text ────────────────────────────
function HighlightedText({
  text,
  highlights = [],
}: {
  text: string;
  highlights?: string[];
}) {
  if (highlights.length === 0) return <span>{text}</span>;

  const escaped = highlights.map((h) =>
    h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        const isHighlight = highlights.some(
          (h) => h.toLowerCase() === part.toLowerCase(),
        );
        return isHighlight ? (
          <span
            key={i}
            className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium border-b-[1.5px] border-blue-300"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
}

// ── Sample transcript data ───────────────────────────────────────────
const SAMPLE_TRANSCRIPT: TranscriptEntry[] = [
  {
    id: '1',
    speaker: 'John',
    timestamp: '00:00:12',
    text: 'Good morning everyone. Today we will discuss system design principles and how they apply to large-scale applications.',
    highlights: ['system design', 'large-scale'],
  },
  {
    id: '2',
    speaker: 'Sarah',
    timestamp: '00:01:34',
    text: 'The architecture should be scalable from day one. We need to think about horizontal scaling and load balancing.',
    highlights: ['scalable', 'horizontal scaling', 'load balancing'],
  },
  {
    id: '3',
    speaker: 'John',
    timestamp: '00:02:45',
    text: "Exactly. Let's start with the microservices approach. Each service should be independently deployable.",
    highlights: ['microservices', 'independently deployable'],
  },
  {
    id: '4',
    speaker: 'Sarah',
    timestamp: '00:04:18',
    text: 'We should also consider the database layer. Do we go with SQL or NoSQL for the main data store?',
    highlights: ['database', 'SQL', 'NoSQL'],
  },
  {
    id: '5',
    speaker: 'John',
    timestamp: '00:05:22',
    text: 'For the user data, SQL makes sense. But for event logging and analytics, NoSQL would be more efficient.',
    highlights: ['user data', 'event logging', 'analytics'],
  },
  {
    id: '6',
    speaker: 'Sarah',
    timestamp: '00:07:01',
    text: "Agreed. Let's also talk about caching strategies. Redis could help reduce database load significantly.",
    highlights: ['caching', 'Redis', 'database load'],
  },
  {
    id: '7',
    speaker: 'John',
    timestamp: '00:08:30',
    text: 'Good point. We should implement a write-through cache for frequently accessed data.',
    highlights: ['write-through cache'],
  },
  {
    id: '8',
    speaker: 'Sarah',
    timestamp: '00:10:15',
    text: 'For the API gateway, I suggest using rate limiting and circuit breaker patterns to handle failures gracefully.',
    highlights: ['API gateway', 'rate limiting', 'circuit breaker'],
  },
  {
    id: '9',
    speaker: 'John',
    timestamp: '00:12:50',
    text: "That's a great suggestion. We should also add retry logic with exponential backoff.",
    highlights: ['retry logic', 'exponential backoff'],
  },
  {
    id: '10',
    speaker: 'Sarah',
    timestamp: '00:13:28',
    text: "Let's not forget about monitoring and observability. We need distributed tracing across all services.",
    highlights: ['monitoring', 'observability', 'distributed tracing'],
  },
];

const SAMPLE_KEY_POINTS: KeyPoint[] = [
  { text: 'System design principles for large-scale applications' },
  { text: 'Microservices architecture with independent deployment' },
  { text: 'Hybrid database approach: SQL for user data, NoSQL for analytics' },
  { text: 'Caching with Redis to reduce database load' },
  { text: 'Write-through cache for frequently accessed data' },
];

const SAMPLE_DECISIONS: Decision[] = [
  { text: 'Use microservices architecture pattern' },
  { text: 'SQL database for user data storage' },
  { text: 'NoSQL for event logging and analytics' },
  { text: 'Redis for caching layer implementation' },
];

const SAMPLE_ACTION_ITEMS: ActionItem[] = [
  { text: 'Design microservices boundaries', assignee: 'John' },
  { text: 'Set up database schemas for SQL and NoSQL', assignee: 'Sarah' },
  { text: 'Configure Redis caching layer', assignee: 'John' },
  { text: 'Implement API gateway with rate limiting', assignee: 'Sarah' },
  { text: 'Set up Prometheus and Grafana monitoring', assignee: 'John' },
];

// ── Main Page Component ──────────────────────────────────────────────
export default function MeetingTranscriptPage() {
  const params = useParams();
  const meetingId = params.meetingId as string;
  const { selectedMeeting, fetchMeetingById } = useMeetingsStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(958); // 00:15:58

  // Fetch meeting data
  useEffect(() => {
    if (meetingId) {
      fetchMeetingById(meetingId);
    }
  }, [meetingId, fetchMeetingById]);

  // Live timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const meetingTitle = selectedMeeting?.title || 'Software Engineering Lecture';

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* ── Top Header Bar ──────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">{meetingTitle}</h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
            <Circle className="w-2.5 h-2.5 fill-red-500 text-red-500 animate-pulse" />
            Live Recording
          </span>
          <span className="text-sm font-medium text-gray-500 tabular-nums">
            {formatTimer(elapsedSeconds)}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            className="!bg-red-500 hover:!bg-red-600 !border-none font-semibold px-5 text-sm rounded-lg"
          >
            End Meeting
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* ── Main Content: Two Column Layout ─────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 p-5 overflow-hidden min-h-0">
        {/* ── Left Column: Live Transcript ─────────────────── */}
        <div className="min-h-0 overflow-hidden flex">
          <Card className="flex flex-col flex-1 overflow-hidden !shadow-sm">
            <div className="px-6 pt-5 pb-4 shrink-0">
              <h2 className="text-base font-bold text-gray-900">
                Live Transcript
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
              {SAMPLE_TRANSCRIPT.map((entry) => {
                const color = getSpeakerColor(entry.speaker);
                return (
                  <div key={entry.id} className="flex gap-3 items-start group">
                    <Avatar size="sm" className="mt-0.5 shrink-0">
                      <AvatarFallback
                        className={`${color.bg} ${color.text} text-xs font-semibold`}
                      >
                        {entry.speaker.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {entry.speaker}
                        </span>
                        <span className="text-xs text-gray-400 tabular-nums">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 m-0">
                        <HighlightedText
                          text={entry.text}
                          highlights={entry.highlights}
                        />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Right Column: AI Summary ─────────────────────── */}
        <div className="min-h-0 overflow-hidden flex">
          <Card className="flex flex-col flex-1 overflow-hidden !shadow-sm">
            <div className="px-5 pt-5 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[0.65rem] font-bold tracking-wide shrink-0">
                  AI
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  AI Summary
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Key Points */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Key Points
                  </h3>
                </div>
                <ul className="space-y-2">
                  {SAMPLE_KEY_POINTS.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[0.8125rem] text-gray-600 leading-relaxed"
                    >
                      <span className="w-[7px] h-[7px] rounded-full bg-blue-500 shrink-0 mt-[6px]" />
                      <span className="flex-1">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Decisions */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Decisions
                  </h3>
                </div>
                <ul className="space-y-2">
                  {SAMPLE_DECISIONS.map((decision, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[0.8125rem] text-gray-600 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="flex-1">{decision.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Action Items */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Action Items
                  </h3>
                </div>
                <ul className="space-y-2">
                  {SAMPLE_ACTION_ITEMS.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-[0.8125rem] text-gray-600 leading-relaxed"
                    >
                      <span className="w-[7px] h-[7px] rounded-full bg-amber-400 shrink-0" />
                      <span className="flex-1">{item.text}</span>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                        {item.assignee}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Bottom Action Bar ───────────────────────────────── */}
      <footer className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-1">
          <Button variant="ghost" className="text-sm font-medium text-gray-600 gap-1.5">
            <Save className="w-4 h-4" />
            Save Notes
          </Button>
          <Button variant="ghost" className="text-sm font-medium text-gray-600 gap-1.5">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        <div>
          <Button
            variant="primary"
            className="font-semibold px-5 text-sm gap-1.5 rounded-lg"
          >
            <Sparkles className="w-4 h-4" />
            Generate Flashcards
          </Button>
        </div>
      </footer>
        </div>
      </DashboardLayout>
    </>
  );
}
