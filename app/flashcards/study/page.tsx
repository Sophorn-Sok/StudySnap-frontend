'use client';

import FlashcardStudyMode from '@/components/flashcard/StudyMode';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function FlashcardStudyPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <FlashcardStudyMode />
      </DashboardLayout>
    </>
  );
}
