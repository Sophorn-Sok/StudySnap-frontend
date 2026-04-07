'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Layers2, Video, BarChart3, Share2, Tag, Settings } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Branding */}
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold text-gray-900">StudySnap</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" href={ROUTES.DASHBOARD} isActive={isRouteActive(ROUTES.DASHBOARD)} />
        <SidebarItem icon={FileText} label="Notes" href={ROUTES.NOTES} isActive={isRouteActive(ROUTES.NOTES)} />
        <SidebarItem icon={Layers2} label="Flashcards" href={ROUTES.FLASHCARDS} isActive={isRouteActive(ROUTES.FLASHCARDS)} />
        <SidebarItem icon={Video} label="Meetings" href={ROUTES.MEETINGS} isActive={isRouteActive(ROUTES.MEETINGS)} />
        <SidebarItem icon={BarChart3} label="Analytics" href={ROUTES.ANALYTICS} isActive={isRouteActive(ROUTES.ANALYTICS)} />
        <SidebarItem icon={Share2} label="Shared" href="/shared" isActive={isRouteActive('/shared')} />
        <SidebarItem icon={Tag} label="Pricing" href="/pricing" isActive={isRouteActive('/pricing')} />
        <SidebarItem icon={Settings} label="Settings" href={ROUTES.SETTINGS} isActive={isRouteActive(ROUTES.SETTINGS)} />
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
            H
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Hour</p>
            <p className="text-xs text-gray-500 truncate">hour@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive = false }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200',
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className={cn('w-5 h-5', isActive ? 'text-blue-600' : 'text-gray-600')} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};
