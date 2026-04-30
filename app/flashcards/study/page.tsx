'use client';

import { Suspense } from 'react';
import FlashcardStudyMode from '@/components/flashcard/StudyMode';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function FlashcardStudyPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <Suspense fallback={<div className="p-8 text-center">Loading study mode...</div>}>
          <FlashcardStudyMode />
        </Suspense>
      </DashboardLayout>
    </>
  );
}
