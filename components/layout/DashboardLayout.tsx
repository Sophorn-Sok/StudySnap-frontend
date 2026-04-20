'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-[calc(100dvh-60px)] bg-[#F8FAFC] [--background:oklch(1_0_0)] [--foreground:oklch(0.145_0_0)] [--card:oklch(1_0_0)] [--card-foreground:oklch(0.145_0_0)] [--popover:oklch(1_0_0)] [--popover-foreground:oklch(0.145_0_0)] [--muted:oklch(0.97_0_0)] [--muted-foreground:oklch(0.556_0_0)] [--accent:oklch(0.97_0_0)] [--accent-foreground:oklch(0.205_0_0)] [--border:oklch(0.922_0_0)]">
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