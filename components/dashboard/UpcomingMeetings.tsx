'use client';

import { Video } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Meeting } from '@/types';
import { formatDate } from '@/utils/helpers';

interface UpcomingMeetingView {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  dateLabel: string;
}

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  isLoading?: boolean;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function dateLabelFor(date: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Tomorrow';
  return formatDate(date);
}

function toMeetingView(meeting: Meeting): UpcomingMeetingView {
  const start = new Date(meeting.createdAt);
  const durationMinutes = Math.max(30, Math.round((meeting.duration ?? 0) / 60));
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  return {
    id: meeting.id,
    title: meeting.title,
    startTime: formatTime(start),
    endTime: formatTime(end),
    dateLabel: dateLabelFor(start),
  };
}

const MeetingCard = ({ meeting }: { meeting: UpcomingMeetingView }) => {
  return (
    <Card className="p-6 border border-gray-200 shadow-none! rounded-lg">
      <div className="flex gap-4">
        {/* Meeting Icon */}
        <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 text-gray-700" />
        </div>

        {/* Meeting Details */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{meeting.title}</h4>
          <p className="text-xs text-gray-500 mb-4">
            {meeting.startTime} – {meeting.endTime} • {meeting.dateLabel}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href={`/meetings/${meeting.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50 h-7 px-4 text-sm font-medium"
              >
                Join
              </Button>
            </Link>
            <Link href={`/meetings/${meeting.id}`}>
              <Button
                variant="primary"
                size="sm"
                className="bg-blue-100 text-blue-600 hover:bg-blue-200 h-7 px-4 text-sm font-medium"
              >
                Auto-Transcribe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const UpcomingMeetings = ({ meetings, isLoading = false }: UpcomingMeetingsProps) => {
  const upcomingMeetings = meetings.slice(0, 2).map(toMeetingView);

  return (
    <Card className="p-6 border border-gray-200 shadow-none! rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-sm text-gray-500">Loading meetings...</p>}

        {!isLoading && upcomingMeetings.length === 0 && (
          <p className="text-sm text-gray-500">No meetings yet.</p>
        )}

        {!isLoading && upcomingMeetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
      </div>
    </Card>
  );
};
