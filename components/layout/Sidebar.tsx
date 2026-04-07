'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import {
  Sparkles,
  BookOpen,
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Mic,
  BarChart3,
  Users,
  CreditCard,
  Settings
} from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD || '/dashboard', icon: LayoutDashboard },
    { name: 'Notes', href: ROUTES.NOTES || '/notes', icon: FileText },
    { name: 'Flashcards', href: ROUTES.FLASHCARDS || '/flashcards', icon: BrainCircuit },
    { name: 'Meetings', href: ROUTES.MEETINGS || '/meetings', icon: Mic },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Shared', href: '/shared', icon: Users },
  ];

  const bottomItems = [
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Settings', href: ROUTES.SETTINGS || '/settings', icon: Settings },
  ];

  const renderItem = (item: typeof navItems[0]) => {
    const isActive = pathname === item.href || (pathname && pathname.startsWith(item.href) && item.href !== '/' && item.name !== 'Dashboard');
    const Icon = item.icon;
    return (
      <li key={item.name}>
        <Link
          href={item.href}
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200",
            isActive
              ? "bg-blue-50 text-blue-600 font-bold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Icon size={20} className={isActive ? "" : ""} />
          <span className="text-[15px] font-medium tracking-wide">{item.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="w-full flex flex-col p-6 h-full font-sans">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 group cursor-pointer">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Sparkles size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">StudySnap</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        <ul className="space-y-1">
          {navItems.map(renderItem)}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto space-y-6">
        <ul className="space-y-1">
          {bottomItems.map(renderItem)}
        </ul>
      </div>
    </div>
  );
};

