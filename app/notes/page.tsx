'use client';

import NotesPageContent from '@/components/note/page';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';

export default function NotesPage() {
  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <NotesPageContent />
    </DashboardLayout>
  );
}
