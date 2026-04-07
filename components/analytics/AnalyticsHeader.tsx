'use client';

import { ChevronDown } from 'lucide-react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';

export const AnalyticsHeader = () => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Track your learning progress</p>
      </div>

      <Menubar className="border border-gray-200 bg-white rounded-lg px-1 h-9">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 px-2 py-1 cursor-pointer">
            This Week
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </MenubarTrigger>
          <MenubarContent align="end" className="w-40">
            <MenubarItem className="cursor-pointer">Today</MenubarItem>
            <MenubarItem className="cursor-pointer font-medium">This Week</MenubarItem>
            <MenubarItem className="cursor-pointer">This Month</MenubarItem>
            <MenubarItem className="cursor-pointer">Last 3 Months</MenubarItem>
            <MenubarItem className="cursor-pointer">All Time</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
