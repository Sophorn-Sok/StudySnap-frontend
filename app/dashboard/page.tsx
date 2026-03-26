'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to StudySnap</h1>
          <p className="text-gray-600">
            Your central hub for notes, flashcards, and AI-powered meeting transcripts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">📝 Notes</h2>
              <p className="text-gray-600">Create and manage your study notes</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">🎴 Flashcards</h2>
              <p className="text-gray-600">Build and study flashcard decks</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">🎤 Meetings</h2>
              <p className="text-gray-600">Transcribe and summarize meetings with AI</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
