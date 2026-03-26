'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { useNotesStore } from '@/store';
import { useEffect } from 'react';
import Link from 'next/link';

export default function NotesPage() {
  const { notes, isLoading, fetchNotes } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Notes</h1>
            <Link href="/notes/new">
              <Button>Create New Note</Button>
            </Link>
          </div>

          {isLoading ? (
            <p>Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-600">No notes yet. Create your first note!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer">
                    <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{note.content}</p>
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
