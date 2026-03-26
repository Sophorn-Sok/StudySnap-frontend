'use client';

import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          StudySnap
        </Link>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
            Dashboard
          </Link>
          <Link href="/settings" className="text-gray-600 hover:text-gray-800">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};
