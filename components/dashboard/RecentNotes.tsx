'use client';

import { FileText, Clock } from 'lucide-react';
import Link from 'next/link';

interface NoteItem {
  id: string;
  title: string;
  timestamp: string;
  size: string;
}

const mockNotes: NoteItem[] = [
  {
    id: '1',
    title: 'Machine Learning Lecture Notes',
    timestamp: '2 hours ago',
    size: '1.2 MB',
  },
  {
    id: '2',
    title: 'Software Engineering Summary',
    timestamp: '5 hours ago',
    size: '845 KB',
  },
  {
    id: '3',
    title: 'Database Design Concepts',
    timestamp: 'Yesterday',
    size: '2.1 MB',
  },
];

const NoteRow = ({ note }: { note: NoteItem }) => {
  return (
    <Link
      href={`/notes/${note.id}`}
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
            {note.timestamp}
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{note.size}</span>
    </Link>
  );
};

export const RecentNotes = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Notes</h3>
        <Link href="/notes" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>
      <div>
        {mockNotes.map((note) => (
          <NoteRow key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};
