'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {sidebar && (
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200">{sidebar}</aside>
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
