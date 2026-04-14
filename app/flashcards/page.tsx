'use client';

import FlashcardsPageContent from '@/components/flashcard/page';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function FlashcardsPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <FlashcardsPageContent />
      </DashboardLayout>
    </>
  );
}

