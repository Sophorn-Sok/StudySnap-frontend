'use client';

import { Video, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  dateLabel: string;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'AI Lecture',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    dateLabel: 'Today',
  },
  {
    id: '2',
    title: 'Software Engineering Discussion',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    dateLabel: 'Tomorrow',
  },
];

const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  return (
    <Card className="p-6 border border-gray-200 !shadow-none rounded-lg">
      <div className="flex gap-4">
        {/* Meeting Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
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
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-200 hover:bg-gray-50 h-7 px-4 text-sm font-medium"
            >
              Join
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-100 text-blue-600 hover:bg-blue-200 h-7 px-4 text-sm font-medium"
            >
              Auto-Transcribe
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const UpcomingMeetings = () => {
  return (
    <Card className="p-6 border border-gray-200 !shadow-none rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
      </div>

      <div className="space-y-4">
        {mockMeetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </Card>
  );
};
