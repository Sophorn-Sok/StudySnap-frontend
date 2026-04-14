'use client';

import NotesPageContent from '@/components/note/page';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function NotesPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <NotesPageContent />
      </DashboardLayout>
    </>
  );
}
