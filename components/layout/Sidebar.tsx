'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Mic,
  BarChart3,
  Users,
  CreditCard,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Notes', href: ROUTES.NOTES, icon: FileText },
    { name: 'Flashcards', href: ROUTES.FLASHCARDS, icon: BrainCircuit },
    { name: 'Meetings', href: ROUTES.MEETINGS, icon: Mic },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Shared', href: '/shared', icon: Users },
  ];

  const bottomItems: NavItem[] = [
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
  ];

  const isRouteActive = (href: string, name: string) => {
    if (!pathname) return false;
    if (name === 'Dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderItem = (item: NavItem) => {
    const isActive = isRouteActive(item.href, item.name);
    const Icon = item.icon;

    return (
      <li key={item.name}>
        <Link
          href={item.href}
          aria-current={isActive ? 'page' : undefined}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200',
            isActive
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <Icon size={20} />
          <span className="text-[15px] font-medium tracking-wide">{item.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="w-full flex flex-col p-6 h-full font-sans bg-white">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Sparkles size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">StudySnap</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">{navItems.map(renderItem)}</ul>
      </nav>

      <div className="mt-auto pt-6">
        <ul className="space-y-1">{bottomItems.map(renderItem)}</ul>
      </div>
    </div>
  );
};