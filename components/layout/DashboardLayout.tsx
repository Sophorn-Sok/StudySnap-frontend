'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-50">
      {sidebar && (
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">{sidebar}</aside>
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
