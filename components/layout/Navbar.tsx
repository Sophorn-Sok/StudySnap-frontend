'use client';

import { Search, Bell } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';
import { AvatarDropdown } from '@/components/dashboard/AvatarDropdown';

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex-shrink-0 w-32">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-8">
          <InputGroup className="h-10 w-full max-w-md border-gray-200 bg-gray-50">
            <InputGroupAddon>
              <Search className="w-4 h-4 text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search notes, flashcards..."
              className="h-10 placeholder:text-gray-400"
            />
          </InputGroup>
        </div>

        {/* Right: Actions */}
        <div className="flex-shrink-0 flex items-center gap-3 w-32 justify-end">
          <Menubar className="border-none bg-transparent p-0 h-auto gap-0">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 px-0 py-0">
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
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <AvatarDropdown />
        </div>
      </div>
    </nav>
  );
};
