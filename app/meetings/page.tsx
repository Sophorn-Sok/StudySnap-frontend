'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useMeetingsStore } from '@/store';
import { useEffect } from 'react';
import Link from 'next/link';

export default function MeetingsPage() {
  const { meetings, isLoading, fetchMeetings } = useMeetingsStore();

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Meeting History</h1>
          </div>

          {isLoading ? (
            <p>Loading meetings...</p>
          ) : meetings.length === 0 ? (
            <p className="text-gray-600">No meetings yet.</p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                  <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer">
                    <h3 className="font-semibold text-lg mb-2">{meeting.title}</h3>
                    <p className="text-gray-500 text-sm">Duration: {meeting.duration}s</p>
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
