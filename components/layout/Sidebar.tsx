'use client';

import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export const Sidebar = () => {
  return (
    <div className="p-4">
      <ul className="space-y-2">
        <li>
          <Link href={ROUTES.DASHBOARD} className="block p-2 hover:bg-gray-100 rounded">
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link href={ROUTES.NOTES} className="block p-2 hover:bg-gray-100 rounded">
            📝 Notes
          </Link>
        </li>
        <li>
          <Link href={ROUTES.FLASHCARDS} className="block p-2 hover:bg-gray-100 rounded">
            🎴 Flashcards
          </Link>
        </li>
        <li>
          <Link href={ROUTES.MEETINGS} className="block p-2 hover:bg-gray-100 rounded">
            🎤 Meetings
          </Link>
        </li>
        <li>
          <Link href={ROUTES.SETTINGS} className="block p-2 hover:bg-gray-100 rounded">
            ⚙️ Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};
