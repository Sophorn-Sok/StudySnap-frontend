'use client';

import { FileText, Clock } from 'lucide-react';
import Link from 'next/link';
import { Note } from '@/types';
import { getRelativeTime } from '@/utils/helpers';

interface RecentNotesProps {
  notes: Note[];
  isLoading?: boolean;
}

function formatSizeFromContent(content: string) {
  const bytes = new TextEncoder().encode(content ?? '').length;

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const NoteRow = ({ note }: { note: Note }) => {
  const timestamp = getRelativeTime(note.updatedAt);
  const size = formatSizeFromContent(note.content);

  return (
    <Link
      href="/notes"
      className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{note.title}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {timestamp}
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{size}</span>
    </Link>
  );
};

export const RecentNotes = ({ notes, isLoading = false }: RecentNotesProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Notes</h3>
        <Link href="/notes" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>
      <div>
        {isLoading && (
          <div className="p-4 text-sm text-gray-500">Loading notes...</div>
        )}

        {!isLoading && notes.length === 0 && (
          <div className="p-4 text-sm text-gray-500">No notes yet. Create your first note to see it here.</div>
        )}

        {!isLoading && notes.map((note) => <NoteRow key={note.id} note={note} />)}
      </div>
    </div>
  );
};
