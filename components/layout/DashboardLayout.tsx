'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-[calc(100dvh-60px)] bg-[#F8FAFC]">
      {sidebar && (
        <aside className="hidden lg:flex w-64 bg-white border-r border-[#E2E8F0] flex-col shrink-0 overflow-y-auto transition-all duration-300 z-10">
          {sidebar}
        </aside>
      )}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
};