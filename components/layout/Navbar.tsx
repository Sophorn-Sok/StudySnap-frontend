'use client';

import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { Search, Bell, Menu, X, Plus, Calendar, Clock, ChevronRight } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AvatarDropdown } from '@/components/dashboard/AvatarDropdown';
import { ROUTES } from '@/utils/constants';

const mobileNavItems = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD },
  { label: 'Notes', href: ROUTES.NOTES },
  { label: 'Flashcards', href: ROUTES.FLASHCARDS },
  { label: 'Meetings', href: ROUTES.MEETINGS },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Shared', href: '/shared' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Settings', href: ROUTES.SETTINGS },
];

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 [--background:oklch(1_0_0)] [--foreground:oklch(0.145_0_0)] [--popover:oklch(1_0_0)] [--popover-foreground:oklch(0.145_0_0)] [--muted:oklch(0.97_0_0)] [--muted-foreground:oklch(0.556_0_0)] [--accent:oklch(0.97_0_0)] [--accent-foreground:oklch(0.205_0_0)] [--border:oklch(0.922_0_0)]">
      <div className="h-15 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 p-0">
              <div className="p-5 border-b border-gray-100">
                <Logo size="md" />
              </div>
              <div className="p-3 space-y-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Logo size="sm" className="lg:hidden" />
        </div>

        {/* Left: Search */}
        <div className="hidden md:block w-72">
          <InputGroup className="h-9 w-full border-gray-200 bg-gray-50">
            <InputGroupAddon>
              <Search className="w-4 h-4 text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search notes, flashcards..."
              className="h-9 placeholder:text-gray-400"
            />
          </InputGroup>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Menubar className="hidden sm:flex border-none bg-transparent p-0 h-auto gap-0">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                Create
              </MenubarTrigger>
              <MenubarContent align="end" className="w-48">
                <MenubarItem className="cursor-pointer">
                  New Note
                </MenubarItem>
                <MenubarItem className="cursor-pointer">
                  New Deck
                </MenubarItem>
                <MenubarItem className="cursor-pointer">
                  Start Meeting
                </MenubarItem>
                <MenubarItem className="cursor-pointer">
                  Upload Recording
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <AvatarDropdown />
        </div>
      </div>
    </nav>
  );
};
