'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useMeetingsStore } from '@/store';
import { useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, Video } from 'lucide-react';
import { Meeting } from '@/types';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
};

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export default function MeetingsPage() {
  const { meetings, isLoading, fetchMeetings } = useMeetingsStore();

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="max-w-5xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Meeting History</h1>
              <p className="text-gray-500 mt-1">Review and manage your recorded sessions.</p>
            </div>
            <Link href="/new-meeting" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2">
              <Video className="w-4 h-4" />
              New Meeting
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium animate-pulse">Loading meetings...</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No meetings yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Start your first meeting to record, transcribe, and generate AI notes automatically.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mx-auto transition-colors">
                Recording guide <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {meetings.map((meeting: Meeting) => (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="group">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-100 group-hover:bg-blue-50/10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="bg-blue-600/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {meeting.title || "Untitled Session"}
                        </h3>
                        <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(meeting.createdAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatDuration(meeting.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white p-2 rounded-lg">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
